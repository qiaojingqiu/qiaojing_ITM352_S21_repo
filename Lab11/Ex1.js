
//To evaluate whether the input is a positive integer or not
function isNonNegInt(q,returnErrors=false) {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
    
};


attributes  =  "QiaoJing;22;ACC";
parts = attributes.split(";");
parts.forEach((item,index) => {console.log(`part ${index} is ${(isNonNegInt(item)?'a':'not a')} quantity`)});
for(parts of parts) {
    console.log(isNonNegInt(parts));
};


monthly_sales = [15,30,30,20,40,10];
var tax_rate = 0.0045;
tax_owing = [];
function totalSales(tax_owing) {
    for(i=0;i<=12;i++) {
        monthly_owing = monthly_sales[i]*tax_rate;
        tax_owing.push(monthly_owing);
    };
        return tax_owing; 
};




