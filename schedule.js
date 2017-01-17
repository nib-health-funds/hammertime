module.exports.enabled = () => {
  return process.env.SLICE === "master";
}
