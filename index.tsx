import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as sgMail from '@sendgrid/mail';
import fetch from 'node-fetch';
import * as moment from 'moment';
import { CosmosClient } from '@azure/cosmos';
import * as http from 'http';

export interface IEmailConfig
{
    api:string;
    from:string;
    simulate?:boolean;
}

export interface IMongoConfig
{
    connectionString:string;
    database:string;
}

export interface ICosmosConfig
{
    connectionString:string;
}

export interface IConfig
{
    email:IEmailConfig;
    mongo:IMongoConfig;
    cosmos:ICosmosConfig;
}

export class ReportLib
{
    httpServer:http.Server;
    config:IConfig =
    {
        email:
        {
            api:"",
            from:""
        },
        mongo:
        {
            connectionString:"",
            database:""
        },
        cosmos:
        {
            connectionString:""
        }
    }

    startHttp(port:number, get:()=>Promise<string>)
    {
       if (this.httpServer == null)
       {
           this.httpServer = new http.Server(async (req,res)=>
           {
               if (req.method == 'GET')
               {
                   let ret = await get();
                   res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
                   res.end(ret);
               }
           });
           
           this.httpServer.listen(port);
       } 
    }

    stopHttp()
    {
        if (this.httpServer)
        {
            this.httpServer.close();
            this.httpServer = null;
        }
    }

    setCosmosConfig(cosmosConfig:ICosmosConfig)
    {
        this.config.cosmos = cosmosConfig;
        return this;
    }


    createCosmosClient()
    {
        return new CosmosClient(this.config.cosmos.connectionString);
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
                console.log(`email sent to ${to}`);
            });  
    }

    renderToString(element:React.ReactElement<any>)
    {
        let html = ReactDOMServer.renderToString(element);
        return html;
    }
}

export {React, fetch, moment};