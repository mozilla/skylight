// Declare environment variable types

namespace NodeJS {
  interface ProcessEnv {
    PROD_RECORDS_URL: string;
    PREVIEW_RECORDS_URL: string;
    NODE_ENV: 'development' | 'production';
  }
}

export {}
