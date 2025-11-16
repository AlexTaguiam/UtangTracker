export const getDashboard = (req, res) => {
  res.status(200).send("Dashboard Loaded succesfully");
};

export const getAllCustomers = (req, res) => {
  res.status(200).send("Customers loaded successfully");
};

export const getCustomer = (req, res) => {
  res.status(200).send("customers  details");
};

export const addCustomer = (req, res) => {
  res.status(201).send("New customer added succesfully");
};

export const editCustomer = (req, res) => {
  res.status(200).send("edit customer added succesfully");
};

export const deleteCustomer = (req, res) => {
  res.status(200).send("customer deleted succesfully");
};
