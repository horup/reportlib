import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as sgMail from '@sendgrid/mail';

export function renderToString(element:React.ReactElement<any>)
{
    let html = ReactDOMServer.renderToString(element);
    return html;
}

export function sendEmail(api:string, from:string, to:string[], title:string, body:string)
{
    sgMail.setApiKey(api);
    sgMail.sendMultiple(
        {
            to:to,
            from:"setireport@farmonline.net", 
            html:body,
            personalizations:[{to:to}],
            subject:title
        }).then(()=>
        {
            console.log("mail sent!");
        });  
}

export {React};