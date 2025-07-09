const customfavIcon =
  'https://res.cloudinary.com/dphleqb5t/image/upload/v1713724442/jc-develop/favicon-c_qlvrpv.png'; //adding our favicon to swagger

const customCss = `
    .topbar{
        animation: navanimation linear both;
        animation-range: 0 100px;
        animation-timeline: scroll(root);
        position: fix;
        top: 0px;
        z-index: 1
    }
    .topbar-wrapper {
        content: Prueba; color: white;
    }  
   .topbar-wrapper a {
    display: inline-block !important;
    width: 100px !important;
    height: 100px !important;
    background: url(https://fluttrium.com/_next/image?url=%2Flogo.png&w=64&q=75) no-repeat center center !important;
    background-size: contain !important;
    text-indent: -9999px !important;
}

.topbar-wrapper a:before {
    content: '' !important;
}
    .swagger-ui .opblock .opblock-summary-description { 
        font-weight: 900 
    }
    .description .renderedMarkdown p {
        font-size: 1rem;
    }
    @keyframes navanimation {
        to {
            opacity: 0.9;
            backdrop-filter: blur(10px);
        }
    }
`;

const customSiteTitle = 'FluttriumAPI'; //add site title to swagger for nice SEO

const customJs = 'script url'; //uncomment this line to add a custom script file
const customJsStr = "alert('prueba')"; //uncomment this line to add a custom script

const swaggerOptions = {
  customfavIcon,
  customCss,
  customSiteTitle,
  // customJs,   //uncomment this line to add a custom script file
  // customJsStr,  //uncomment this line to add a custom script
  swaggerOptions: {
    persistAuthorization: true, // this helps to retain the token even after refreshing the (swagger UI web page)
    // defaultModelsExpandDepth: -1 //uncomment this line to stop seeing the schema on swagger ui
  },
};

const swaggerTitle = 'Документация к приложению магазина';

const swaggerDescription = `
  <p>Полнофункциональный REST API для интернет-магазина с авторизацией, каталогом, корзиной и админ-панелью.</p>
`;

export { swaggerOptions, swaggerTitle, swaggerDescription };
