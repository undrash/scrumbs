


export default class DatabaseConfig {
    public static readonly URI: string =  `mongodb://${ process.env.ENV_DOCKER === "true" ? "mongo:27017" : "localhost"  }/scrumbs-app`;
}