// Declare environment variable types

namespace NodeJS {
  interface ProcessEnv {
    RECORDS_URL: string;
    NODE_ENV: 'development' | 'production';
  }
}

export {}
