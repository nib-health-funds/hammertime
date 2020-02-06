module.exports = function allValidDBInstances(instance) {
  return (
    instance.StorageType != 'aurora' &&
    instance.DBInstanceStatus == this &&
    instance.MultiAZ == false &&
    instance.ReadReplicaDBInstanceIdentifiers.length == 0 &&
    instance.ReadReplicaDBClusterIdentifiers.length == 0
  );
}
