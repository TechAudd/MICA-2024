import Form from "../models/form.js";

const getEnumValues = (schema, path) => schema.path(path).enumValues;
// Define the API route
export const registersCount =  async (req, res) => {
    try {
      // Extract possible values from the schema
      const registerTypeValues = getEnumValues(Form.schema, 'registerType');
      const occupationValues = getEnumValues(Form.schema, 'occupation');
      const memberValues = getEnumValues(Form.schema, 'member');
  
      // Query the database and group the results
      const results = await Form.aggregate([
        {
            $match: { payment: true }
        },
        {
          $group: {
            _id: {
              registerType: "$registerType",
              occupation: "$occupation",
              member: "$member"
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: {
              registerType: "$_id.registerType",
              occupation: "$_id.occupation"
            },
            members: {
              $push: {
                member: "$_id.member",
                count: "$count"
              }
            }
          }
        },
        {
          $group: {
            _id: "$_id.registerType",
            occupations: {
              $push: {
                occupation: "$_id.occupation",
                members: "$members"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            registerType: "$_id",
            occupations: 1
          }
        }
      ]);
  
      // Initialize the response object with all possible combinations set to zero
      const response = registerTypeValues.reduce((acc, regType) => {
        acc[regType] = occupationValues.reduce((occAcc, occType) => {
          occAcc[occType] = memberValues.reduce((memAcc, memType) => {
            memAcc[memType] = 0;
            return memAcc;
          }, {});
          return occAcc;
        }, {});
        return acc;
      }, {});
  
      // Merge the results with the response object
      let totalRegisters = 0;
        results.forEach(result => {
            result.occupations.forEach(occupation => {
                occupation.members.forEach(member => {
                response[result.registerType][occupation.occupation][member.member] = member.count;
                totalRegisters += member.count;
                });
            });
        });
  
      // Send the response
      res.json({ data: response, totalRegisters });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export const registersRevenue = async (req, res) => {
    try {
      // Query the database to get all documents where payment is true
      const forms = await Form.find({ payment: true });
  
      // Calculate the total prices grouped by currency
      const response = forms.reduce((acc, form) => {
        const currency = form.currency;
        const price = parseFloat(form.price);
        if (!acc[currency]) {
          acc[currency] = 0;
        }
        acc[currency] += price;
        return acc;
      }, {});
  
      // Send the response
      res.json({totalPrice: response});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  