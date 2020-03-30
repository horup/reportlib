import {ReportLib, React} from '../index';
const lib = new ReportLib();

const index = <div>Hello Report Lib!</div>;
const html = lib.renderToString(index);
console.log(html);

lib.startHttp(8080, ()=>
{
    return html;
})
