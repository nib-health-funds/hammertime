module.exports.isDryRun = () => {
  const dryRun = process.env.HAMMERTIME_DRY_RUN === 'true';
  console.log(`Is dry run enabled: ${dryRun}`);
  return dryRun.toString();
};
