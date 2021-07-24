const Config = {
    init: () => {
        const configuration = {
            "development": {
                "PORT": 7001,
                "CERT":{
                    "OPTIONS":{
                        algorithm: 'HS512',
                        expiresIn: "30 days",
                        audience: 'Deviant.Code',
                        issuer: 'Deviant.Code @DevOps'
                    }
                },
                "KEY":{
                    "PRIVATE": './private-key.pem',
                    "PUBLIC": './public-key.pem',
                    "SYMETRIC": './symetric-key.txt'
                } 
            },
        
            "production": {
                "PORT": 7001,
                "CERT":{
                    "OPTIONS":{
                        algorithm: 'HS512',
                        expiresIn: "3 days",
                        audience: 'Deviant.Code',
                        issuer: 'Deviant.Code @DevOps'
                    }
                },
                "KEY":{
                    "PRIVATE": './private-key.pem',
                    "PUBLIC": './public-key.pem',
                    "SYMETRIC": './symetric-key.txt'
                } 
            },
            "staging": {
                "PORT": 7001,
                "CERT":{
                    "OPTIONS":{
                        algorithm: 'HS512',
                        expiresIn: "30 days",
                        audience: 'Deviant.Code',
                        issuer: 'Deviant.Code @DevOps'
                    }
                },
                "KEY":{
                    "PRIVATE": './private-key.pem',
                    "PUBLIC": './public-key.pem',
                    "SYMETRIC": './symetric-key.txt'
                } 
            },
        }

        let config = configuration[process.env.NODE_ENV];
        let REALM = '@Deviant';
        
        config.REALM = REALM;
        config.APP_NAME = 'Deviant Code Global Crypt System' ;
        global.config = config;
        return 
    }  
}

module.exports = Config.init();