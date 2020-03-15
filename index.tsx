import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as sgMail from '@sendgrid/mail';
import fetch from 'node-fetch';

export interface IEmailConfig
{
    api:string;
    from:string;
    simulate?:boolean;
}
export interface IConfig
{
    email:IEmailConfig;
}

export class ReportLib
{
    config:IConfig =
    {
        email:
        {
            api:"",
            from:""
        }
    }

    setEmailConfig(emailConfig:IEmailConfig)
    {
        this.config.email = emailConfig;
        return this;
    }

    sendEmail(to:string[], title:string, body:string|React.ReactElement<any>)
    {
        if (typeof body == "object")
        {
            body = this.renderToString(body);
        }
        if (this.config.email.api == "" || this.config.email.from == "")
        {
            throw "api or from is empty";
        }

        if (this.config.email.simulate == true)
        {
            console.log("--------------------");
            console.log("Title: " + title);
            console.log( "From: " + this.config.email.from);
            console.log( "  To: " + to);
            console.log(body);
            console.log("--------------------");
            return;
        }

        sgMail.setApiKey(this.config.email.api);
        sgMail.sendMultiple(
            {
                to:to,
                from:this.config.email.from, 
                html:body,
                personalizations:[{to:to}],
                subject:title
            }).then(()=>
            {
                console.log("mail sent!");
            });  
    }

    renderToString(element:React.ReactElement<any>)
    {
        let html = ReactDOMServer.renderToString(element);
        return html;
    }
}

export {React, fetch};