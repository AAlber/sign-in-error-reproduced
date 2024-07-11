const mail = {
  setApiKey: jest.fn(),
  send: jest.fn(),
};

module.exports = mail;
// fix cannot be compiled under '--isolatedModules' because it is considered a global script file. Add an import, export, or an empty 'export {}' statement to make it a module.
export {};
