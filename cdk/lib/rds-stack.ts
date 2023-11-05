import * as cdk from "aws-cdk-lib";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  SecurityGroup,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
  StorageType,
} from "aws-cdk-lib/aws-rds";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export interface RdsStackProps extends cdk.StackProps {
  vpc: Vpc;
}

export class RdsStack extends cdk.Stack {
  readonly rdsInstance: DatabaseInstance;

  constructor(scope: Construct, id: string, props: RdsStackProps) {
    super(scope, id, props);

    const dbCredentialSecret = new Secret(this, "db-credential-secret", {
      secretName: "db-credential-secret",
      description: "Database credentials for RDS Instance",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "postgres" }),
        excludePunctuation: true,
        generateStringKey: "password",
        passwordLength: 16,
      },
    });

    const securityGroup = SecurityGroup.fromSecurityGroupId(
      this,
      "Rds-Security-Group",
      props.vpc.vpcDefaultSecurityGroup
    );

    this.rdsInstance = new DatabaseInstance(this, "RdsInstance", {
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_15_4,
      }),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      vpc: props.vpc,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      storageType: StorageType.GP2,
      backupRetention: cdk.Duration.days(0),
      securityGroups: [securityGroup],
      deleteAutomatedBackups: true,
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      databaseName: "discord_bot_db",
      port: 5432,
      credentials: Credentials.fromSecret(dbCredentialSecret),
    });

    // this.rdsInstance.connections.allowDefaultPortFromAnyIpv4();
    // this.rdsInstance.connections.allowDefaultPortInternally();
  }
}
