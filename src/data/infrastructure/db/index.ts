import {Sequelize} from 'sequelize';
import Logger from '../../../utils/logger';

export class Database {
    sequelize: Sequelize
    constructor(private readonly DATABASE_URI: string) {
        this.sequelize = new Sequelize(this.DATABASE_URI)
    }

    async authenticate() {
        this.sequelize?.authenticate().then(() => {
            Logger.info('Connected To The Database');
        })
        .catch(error => Logger.error(error));
    }
    
    async close() {
        if (this.sequelize) {
            this.sequelize.close();
        }
    }
}
