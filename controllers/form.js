import Form from "../models/form.js";
import Payment from "../models/payment.js";
import { sse } from "../routes/SSE/sseRoutes.js";
import PDFDocument from "pdfkit"
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import qrcode from "qrcode";
import { calculateAmount } from "../routes/payment.js";
import path from "path";
import moment from 'moment-timezone';
dotenv.config();

export const addRegister = async (req, res) => {
  try {
    // Extract registerType from request parameters
    // const { registerType } = req.params;

    // Extract the remaining data from the request body4
    const formData = { ...req.body};
    // Create a new form entry
    const newForm = new Form(formData);
    // Save the form entry to the database
    await newForm.save();
    const formattedForm = newForm.toJSON();
    sse.send(formattedForm, "newForm");
    // Respond with the created form entry
    return res.json({
      msg: "Registered successfully",
      newForm,
    });
  } catch (err) {
      return res.status(500).json({ message: err.message });
    }
};

export const updateRegister = async (req, res) => {
  try {
    // Extract id from request parameters
    const { id } = req.params;

    // Extract the data to update from the request body
    const updateData = req.body;
    // Find the form entry by id and update it
    const updatedForm = await Form.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    // If form not found
    if (!updatedForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Respond with the updated form entry
    res.status(200).json(updatedForm);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const generatePDFInvoice = async (populatedForm,basePrice) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    // Add content to PDF
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer.toString('base64'));
    });

    const pageWidth = doc.page.width;
    const margin = 50;
    const contentWidth = pageWidth - 3 * margin;

    // Load logos
    const leftLogoPath = path.resolve('logo/logoOne.png'); 
    const rightLogoPath = path.resolve('logo/logoTwo.png');

    // Add logos to PDF
    doc.image(leftLogoPath, margin, margin, { width: 140, height:50 });
    doc.image(rightLogoPath, pageWidth - margin - 100, margin, { width: 140, height:50 });

    // Start PDF generation
    doc.fontSize(20).font('Helvetica-Bold').text('INVOICE', margin, doc.y + 80, { align: 'center' });
    doc.moveDown();

    // Third Part: Billed From and Billed To (similar to your existing implementation)

    // Example: Billed From and Billed To sections (modify as per your actual data)

    // Billed From
    doc.fontSize(14).font('Helvetica-Bold').text('Billed From:', margin, doc.y + 20);
    doc.fontSize(12).font('Helvetica').text('Mahindra University', margin, doc.y);
    doc.text('Address: Survey No: 62/1A, Bahadurpally, Jeedimetla,', margin, doc.y);
    doc.text('Hyderabad, Telangana, India - 500043', margin, doc.y);
    // doc.text('', margin, doc.y);
    // doc.moveDown();

    // Billed To
    doc.fontSize(14).font('Helvetica-Bold').text('Billed To:', margin + contentWidth - doc.widthOfString('Billed To:'), doc.y + 20);
    doc.fontSize(12).font('Helvetica').text(`Name: ${populatedForm.name}`, margin + contentWidth - doc.widthOfString(`Name: ${populatedForm.name}`), doc.y);
    doc.text(`Mobile Number: ${populatedForm.phone}`, margin + contentWidth - doc.widthOfString(`Mobile Number: ${populatedForm.phone}`), doc.y);
    doc.text(`Email ID: ${populatedForm.mailId}`, margin + contentWidth - doc.widthOfString(`Email ID: ${populatedForm.mailId}`), doc.y);
    doc.text(`Paper Titile: ${populatedForm.paperTitle}`, margin + contentWidth - doc.widthOfString(`Paper Titile: ${populatedForm.paperTitle}`), doc.y);
    doc.text(`Paper ID: ${populatedForm.paperId}`, margin + contentWidth - doc.widthOfString(`Paper ID: ${populatedForm.paperId}`), doc.y);
    doc.moveUp(2);

    // First Part: Header
    doc.fontSize(16).font('Helvetica-Bold');
    // doc.text('Mahindra University', margin, doc.y);
    // doc.text('Invoice ID:', margin + contentWidth - doc.widthOfString('Invoice ID:'), doc.y).moveUp(1);
    doc.fontSize(12).font('Helvetica');
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, margin, doc.y + 80);
    doc.text(`Transaction ID: ${populatedForm.txnid}`, margin, doc.y);
    doc.text(`Easepay ID: ${populatedForm.paymentId.easepayid}`, margin, doc.y);
    doc.text(`Bank Ref Num: ${populatedForm.paymentId.bank_ref_num}`, margin, doc.y);
    doc.text(`Payment method: ${populatedForm.paymentId.mode}`, margin, doc.y);
    doc.moveDown();

    // Second Part: Line Items
    doc.fontSize(14).font('Helvetica-Bold').text('Invoice Summary', margin, doc.y);
    doc.fontSize(12).font('Helvetica');

    // const totalAmount = populatedForm.price;
    const platformFeePercentage = 3.5;
    let baseAmount, platformFee, totalAmount;

    if (populatedForm.currency == "USD") {
      baseAmount = parseFloat(basePrice);
      platformFee = basePrice * (platformFeePercentage / 100);
      totalAmount = parseFloat(basePrice) + parseFloat(platformFee);
    } else if (populatedForm.currency == "INR") {
      // Reverse calculation to find base amount
      totalAmount = populatedForm.price
      baseAmount = totalAmount / (1 + (platformFeePercentage / 100));
      platformFee = totalAmount - baseAmount;
      // baseAmount = parseFloat(basePrice);
      // platformFee = basePrice * (platformFeePercentage / 100);
      // totalAmount = populatedForm.price
    }

    // Display the amounts in the invoice
    doc.text(`Base Amount (with GST): ${populatedForm.currency} ${baseAmount.toFixed(2)}`, margin, doc.y);
    doc.text(`Platform Fee (${platformFeePercentage}%): ${populatedForm.currency} ${platformFee.toFixed(2)}`, margin, doc.y);
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text(`Total Amount: ${populatedForm.currency} ${totalAmount}`, margin, doc.y + 20);
    doc.moveDown(2);

    doc.fontSize(12).font('Helvetica-Bold').text('Conference head', margin + contentWidth - doc.widthOfString('Conference head:'), doc.y + 20);
    doc.fontSize(10).font('Helvetica-Bold').text('Dr. Sreedhar Madichetty', margin + contentWidth - doc.widthOfString('Dr. Sreedhar Madichetty'), doc.y);

    doc.end();
  });
};

const generateEventPDFBase64 = async (populatedForm,basePrice) => {
  if (populatedForm.registerType === "Doctoral Consortium") {
    populatedForm.registerType = "Research Consortium";
  }

  let professionalDetails=``;
  if (populatedForm.occupation === "Industry Expert"){
    if(populatedForm.member === "IEEE member"){
      professionalDetails = `Professional Information:
Role: ${populatedForm.registerType}
Function Area: ${populatedForm.occupation}
Designation: ${populatedForm.designation}
IEEE Membership: ${populatedForm.member}
Membership ID: ${populatedForm.membershipId}`;
    } else {
      professionalDetails = `Professional Information:
Role: ${populatedForm.registerType}
Function Area: ${populatedForm.occupation}
Designation: ${populatedForm.designation}
IEEE Membership: ${populatedForm.member}`;
    }
  } else {
    if(populatedForm.member === "IEEE member"){
      professionalDetails = `Professional Information:
Role: ${populatedForm.registerType}
Function Area: ${populatedForm.occupation}
IEEE Membership: ${populatedForm.member}
Membership ID: ${populatedForm.membershipId}`;
    } else {
      professionalDetails = `Professional Information:
Role: ${populatedForm.registerType}
Function Area: ${populatedForm.occupation}
IEEE Membership: ${populatedForm.member}`;
    }
  }

  let paperDetails = ``;
  if (populatedForm.registerType === "Listener"){
    paperDetails =``;
  } else if(populatedForm.registerType === "Research Consortium") {
    paperDetails =`Paper Details:
Research Title: ${populatedForm.researchTitle}`;
  }else{
    if(populatedForm.pages === "10"){
        paperDetails =`Paper Details:
Paper Title: ${populatedForm.paperTitle}
Paper ID: ${populatedForm.paperId}
Number of Pages: Less than or equal to 10
Extra Pages: 0`;
    } else {
      paperDetails =`Paper Details:
Paper Title: ${populatedForm.paperTitle}
Paper ID: ${populatedForm.paperId}
Number of Pages: More than 10
Extra Pages: ${populatedForm.pages}`;

    }
  }

  const platformFeePercentage = 3.5;
    let totalAmount;

    if (populatedForm.currency == "USD") {
      totalAmount = parseFloat(basePrice) + parseFloat(basePrice * (platformFeePercentage / 100));
    } else {
      totalAmount = populatedForm.price
    }


  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    // Collect PDF data in buffers array
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer.toString('base64'));
    });

    const pageWidth = doc.page.width;
    const margin = 50;
    const contentWidth = pageWidth - 3 * margin;

    // Load logos
    const leftLogoPath = path.resolve('logo/logoOne.png'); 
    const rightLogoPath = path.resolve('logo/logoTwo.png');

    // Add logos to PDF
    doc.image(leftLogoPath, margin, margin, { width: 140, height:50 });
    doc.image(rightLogoPath, pageWidth - margin - 100, margin, { width: 140, height:50 });

    doc.rect(50, 120, 500, 100).fill('#e31837');

    doc.fontSize(15).fillColor('white').text(
      'Registration Confirmation: The Second International Conference on Cyber physical Systems, Power Electronics and Electric Vehicles- ICPEEV 2024',
      110,
      130,
      {
        width: 400,
        align: 'center',
        lineBreak: true,
        height: 200,
        ellipsis: true,
      }
    );

    doc.rect(220, 240, 200, 20).fill('#808080'); // Gray background for Organizer section
    doc.fontSize(12).fillColor('black').text('Organizer: Mahindra University', 100, 245, { align: 'center' });

    doc.fontSize(14).fillColor('black').text(`Hi ${populatedForm.name},`, 50, 270, {
      width: 500,
      align: 'left',
    });

const additionalText = `Thank you for purchasing 1 ticket(s) for The Second International Conference on Cyber physical Systems, Power Electronics and Electric Vehicles - ICPEEV 2024.`;

// Regular text
doc.fontSize(14).fillColor('black').text(additionalText, {
  width: 500,
  align: 'left',
});

// Bold text
doc.fontSize(16).fillColor('black').font('Helvetica-Bold').text(`Your Booking details are as follows:`, 50, 360,{
  width: 500,
  align: 'left',
});

// Continue with regular text again
doc.fontSize(14).fillColor('black').font('Helvetica').text(`
Booking Id : ${populatedForm.txnid}
Booking Date : ${new Date().toLocaleDateString()}
NAME: ${populatedForm.name}
TYPE: ${populatedForm.registerType}
PRICE: ${populatedForm.currency} ${totalAmount}
`, {
  width: 500,
  align: 'left',
});

doc.fontSize(16).fillColor('black').font('Helvetica-Bold').text(`QR Code of your booking confirmation:`, 50, 500,{
  width: 500,
  align: 'center',
});

    const qrPlaceholderX = 200;
    const qrPlaceholderY = 545;
    const qrPlaceholderSize = 150;

    // Generate QR code with txnid
    qrcode.toDataURL(populatedForm._id.toString(), { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        reject(err);
      }

      // Add QR code to PDF
      doc.image(url, qrPlaceholderX, qrPlaceholderY, { width: qrPlaceholderSize, height: qrPlaceholderSize });

      // Add a new page for registration details and event details
      doc.addPage();

      const pageWidth = doc.page.width;
      const margin = 50;
      const contentWidth = pageWidth - 3 * margin;
  
      // Load logos
      const leftLogoPath = path.resolve('logo/logoOne.png'); 
      const rightLogoPath = path.resolve('logo/logoTwo.png');
  
      // Add logos to PDF
      doc.image(leftLogoPath, margin, margin, { width: 140, height:50 });
      doc.image(rightLogoPath, pageWidth - margin - 100, margin, { width: 140, height:50 });

// Registration Details
doc.fontSize(16).fillColor('black').font('Helvetica-Bold')
  .text('Registration Details:', 50, 120, {
    width: 520,
    align: 'left',
  });
doc.fontSize(15).fillColor('black').font('Helvetica')
  .text(`
Basic Information:
Name: ${populatedForm.name}
Contact: ${populatedForm.phone}
Email: ${populatedForm.mailId}
Affiliation: ${populatedForm.affiliation}
${professionalDetails}
${paperDetails}
`, 50, 120, {
    width: 520,
    align: 'left',
  });


// Event Details
doc.fontSize(16).fillColor('black').font('Helvetica-Bold')
  .text('Event Details:', 50, 420, {
    width: 520,
    align: 'left',
  });

doc.fontSize(15).fillColor('black').font('Helvetica')
  .text(`
Organizer: Mahindra University
Venue: Mahindra University, Survey No. 62/1A, Bahadurpally, Jeedimetla, Hyderabad - 500043, Telangana, INDIA.
Event Date: 26 September 2024 : 8:30 AM - 28 September 2024 : 8:00 PM (IST)
`, 50, 420, {
    width: 520,
    align: 'left',
  });
      doc.fontSize(15).fillColor('black').text('Link: ', {
        width: 520,
        continued: true,
      }).fillColor('blue').text('The Second International Conference on Cyber physical Systems, Power Electronics and Electric Vehicles - ICPEEV 2024.', {
         link: 'https://ietcint.com/user/index',
         underline: true
        });

      const yCoordinate = doc.y + 50;
      
      const eventNote = `(Note: Please bring a copy of this document, either printed or digital, when you visit us.)`;
    
      // Add event note at the bottom
      doc.fontSize(12).fillColor('black').text(eventNote, 50, yCoordinate, {
        width: 500,
        align: 'left',
      });
 
      // End PDF creation
      doc.end();
    });
  });
};

const sendEmailWithAttachment = async (populatedForm, pdfBase64, eventPDFBase64) => {
  try {
    console.log('Starting to send email...');
    
    const email = populatedForm.mailId;
    const userName = populatedForm.name;
    console.log('Recipient email:', email);
    console.log('Recipient name:', userName);

    const transporter = nodemailer.createTransport({
      // service: process.env.EMAIL_SERVICE,
      // host: 'smtpout.secureserver.net',
      // port: 465, // or 587 if you are using TLS
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      // logger: true, // log to console
      // debug: true,  // include SMTP traffic in the logs
    });
    console.log('Transporter created');

    const attachment1 = {
      filename: "Invoice-" + populatedForm.txnid + ".pdf",
      content: Buffer.from(pdfBase64, "base64"),
    };

    const attachment2 = {
      filename: "Registration-" + populatedForm.txnid + ".pdf",
      content: Buffer.from(eventPDFBase64, "base64"),
    };
    console.log('Attachments created');

    const greeting = userName ? `Dear ${userName},` : "Dear Customer,";
    console.log('Greeting created:', greeting);
    
    // Mail options
    const mailOptions = {
      from: {
        name: "MAHINDRA UNIVERSITY",
        address: process.env.EMAIL_USERNAME,
      },
      to: email,
      // cc: process.env.EMAIL_USERNAME,
      cc: "sreedhar.madichetty@mahindrauniversity.edu.in",
      bcc: ["se22peee003@mahindrauniversity.edu.in","se22peee006@mahindrauniversity.edu.in"],
      subject: "Your Registration is Successfully",
      // text: `Your message body`,
      html: `
        <p>${greeting}</p>
        <p>Please find attached the Invoice and Registration.</p>
        <p>Thank you for choosing our services!</p>
        <p>Best regards,<br/>MAHINDRA UNIVERSITY</p>
        <p><b>** PLEASE, DO NOT REPLY TO THIS MAIL **</b></p>
      `,
      attachments: [attachment1, attachment2],
    };
    console.log('Mail options created:', mailOptions);

    // transporter.verify((error, success) => {
    //   if (error) {
    //     console.log(error,"loki");
    //   } else {
    //     console.log('Server is ready to take our messages');
    //   }
    // });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // re-throw the error if you want to propagate it further
  }
};

export const updateWithTxnid = async (req, res) => {
  const { txnid } = req.params;
  const updateData = req.body;

  try {

    const payment = await Payment.findOne({ txnid: txnid });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    const formData = await Form.findOne({ txnid: txnid });

    let extraPages, numberOfPages;
    if (formData.pages == "10") {
      extraPages = "0"
      numberOfPages = "LessEqual10"
    } else {
      extraPages = formData.pages
      numberOfPages = "MoreThan10"
    }

    const currency = formData.currency
    const registerType = formData.registerType
    const occupation = formData.occupation
    const member = formData.member

    const calculatedAmount = await calculateAmount({
      currency,
      registerType,
      occupation,
      member,
      numberOfPages,
      extraPages,
    });

    updateData.paymentId = payment._id;
    updateData.price = payment.net_amount_debit;
    const updatedRegistration = await Form.findOneAndUpdate(
      { txnid: txnid },
      updateData,
      { new: true, runValidators: true }
    );

    // If registration not found
    if (!updatedRegistration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    const populatedForm = await Form.findOne({ txnid: txnid }).populate('paymentId');

    // Generate PDF invoice
    const base64String = await generatePDFInvoice(populatedForm,calculatedAmount.baseAmount.toString());
    const eventPDFBase64 = await generateEventPDFBase64(populatedForm,calculatedAmount.baseAmount.toString())
    const updatedInvoice = await Form.findOneAndUpdate(
      { txnid: txnid },
      { invoice: base64String },
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Send email with attachment
    await sendEmailWithAttachment(populatedForm, base64String, eventPDFBase64);

    // Respond with the updated registration entry and base64 string
    res.status(200).json({
      message: 'Form updated successfully and Mail Sent',
      // pdfBase64: eventPDFBase64,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getRegister = async (req, res) => {
  try {
    // Extract id from request parameters
    const { id } = req.params;

    // Find the form entry by id
    const form = await Form.findById(id).populate('paymentId');

    // If form not found
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Respond with the form entry
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllRegisters = async (req, res) => {
  try {
    const { search, registerType, occupation, member, payment, startDate, endDate, page, limit, sortField, sortOrder } = req.query;
    let query = {};

    // Search by name or phone
    if (search) {
      const keywordRegex = new RegExp(search, "i"); // Create a case-insensitive regex from the keyword
      query.$or = [
        { name: keywordRegex },
        { phone: keywordRegex },
      ];
    }

    // Apply filters
    if (registerType) {
      query.registerType = registerType;
    }
    if (occupation) {
      query.occupation = occupation;
    }
    if (member) {
      query.member = member;
    }
    if (payment) {
      query.payment = payment;
    }

    // Apply date filters
    if (startDate || endDate) {
      const startOfDay = moment.tz(`${startDate}T00:00:00+05:30`, 'Asia/Kolkata').toDate();
      const endOfDay = moment.tz(`${endDate}T23:59:59+05:30`, 'Asia/Kolkata').toDate();
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Pagination parameters
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Sort order (default is descending by createdAt)
    const sortOptions = {};
    if (sortField) {
      sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1; // Ascending (1) or Descending (-1)
    } else {
      sortOptions.createdAt = -1; // Default sort by createdAt in descending order
    }

    // Find matching form entries with pagination
    const forms = await Form.find(query)
      .populate("paymentId")
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    // Count total documents matching the query (for pagination info)
    const totalCount = await Form.countDocuments(query);
    // Respond with paginated results
    res.status(200).json({
      totalPages: Math.ceil(totalCount / pageSize),
      data: forms
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getRegistrationCounts = async (req, res) => {
  try {
    const { search, registerType, occupation, member, payment, startDate, endDate } = req.query;
    let query = {};

    // Search by name or phone
    if (search) {
      const keywordRegex = new RegExp(search, "i");
      query.$or = [
        { name: keywordRegex },
        { phone: keywordRegex },
      ];
    }

    // Apply filters
    if (registerType) {
      query.registerType = registerType;
    }
    if (occupation) {
      query.occupation = occupation;
    }
    if (member) {
      query.member = member;
    }
    if (payment) {
      query.payment = payment;
    }

    // Apply date filters
    if (startDate || endDate) {
      const startOfDay = moment.tz(`${startDate}T00:00:00+05:30`, 'Asia/Kolkata').toDate();
      const endOfDay = moment.tz(`${endDate}T23:59:59+05:30`, 'Asia/Kolkata').toDate();
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Aggregation to count INR, USD, Attendee, Doctoral Consortium, Paper Author, and Members
    const inrCount = await Form.countDocuments({ ...query, currency: 'INR' });
    const usdCount = await Form.countDocuments({ ...query, currency: 'USD' });
    const attendeeCount = await Form.countDocuments({ ...query, registerType: 'Listener' });
    const doctoralConsortiumCount = await Form.countDocuments({ ...query, registerType: 'Doctoral Consortium' });
    const paperAuthorCount = await Form.countDocuments({ ...query, registerType: 'Paper Author' });
    const memberCount = await Form.countDocuments({ ...query, member: true });

    // Respond with the counts
    res.status(200).json({
      inrCount,
      usdCount,
      attendeeCount,
      doctoralConsortiumCount,
      paperAuthorCount,
      memberCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const sendMailtoAll = async (req, res) => {
  try {
    // Fetch all payments
    const payments = await Payment.find({});
    if (!payments.length) {
      return res.status(404).json({ error: 'No payments found' });
    }

    // Loop through each payment
    for (const payment of payments) {
      const txnid = payment.txnid;
      const formData = await Form.findOne({ txnid: txnid });

      if (!formData) {
        continue; // Skip if form data not found
      }

      let extraPages, numberOfPages;
      if (formData.pages === "10") {
        extraPages = "0";
        numberOfPages = "LessEqual10";
      } else {
        extraPages = formData.pages;
        numberOfPages = "MoreThan10";
      }

      const currency = formData.currency;
      const registerType = formData.registerType;
      const occupation = formData.occupation;
      const member = formData.member;

      const calculatedAmount = await calculateAmount({
        currency,
        registerType,
        occupation,
        member,
        numberOfPages,
        extraPages,
      });

      const updateData = {
        paymentId: payment._id,
        price: payment.net_amount_debit,
        ...req.body, // Include additional data from request body if needed
      };

      const updatedRegistration = await Form.findOneAndUpdate(
        { txnid: txnid },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedRegistration) {
        continue; // Skip if registration not found
      }

      const populatedForm = await Form.findOne({ txnid: txnid }).populate('paymentId');

      // Generate PDF invoice
      const base64String = await generatePDFInvoice(populatedForm, calculatedAmount.baseAmount.toString());
      const eventPDFBase64 = await generateEventPDFBase64(populatedForm, calculatedAmount.baseAmount.toString());

      const updatedInvoice = await Form.findOneAndUpdate(
        { txnid: txnid },
        { invoice: base64String },
        { new: true, runValidators: true }
      );

      if (!updatedInvoice) {
        continue; // Skip if invoice not found
      }

      // Send email with attachment
      await sendEmailWithAttachment(populatedForm, base64String, eventPDFBase64);
    }

    res.status(200).json({
      message: 'Forms updated successfully and Mails Sent',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

