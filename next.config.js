/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')
 
const nextConfig = {
    reactStrictMode: false,
    trailingSlash: true,
    basePath: process.env.NODE_ENV === 'production' ? '/sakai-react' : '',
    publicRuntimeConfig: {
        contextPath: process.env.NODE_ENV === 'production' ? '/sakai-react' : '',
        uploadPath: process.env.NODE_ENV === 'production' ? '/sakai-react/upload.php' : '/api/upload'
    }
    ,
  env: {
    ADMIN :"admin",
    ADMIN_ROUTE :"/admin",
    NEXT_PUBLIC_API_URL: "http://172.20.144.138:9080/",
    API_PATH : "/api/",

    AUTH_SERVICE:{
      SIGNIN :`${process.env.NEXT_PUBLIC_API_URL}${process.env.API_PATH}auth/signin`
    },
    
  },
  i18n
};

module.exports = nextConfig;
