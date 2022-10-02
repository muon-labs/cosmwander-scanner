import P from 'pino';

declare global {
  namespace NodeJS {
    interface Global {
      logger: P.Logger;
    }
    interface ProcessEnv {
      PORT: string;
      LOG_LEVEL: string;
      DB_URI: string;
      MNEMONIC: string;
    }
  }
  namespace Express {
    interface Request {}
  }
  var logger: P.Logger;
}