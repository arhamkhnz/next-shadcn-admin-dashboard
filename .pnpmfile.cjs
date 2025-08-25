module.exports = {
  hooks: {
    readPackage(pkg) {
      // Handle peer dependency issues if any
      return pkg;
    },
  },
};
