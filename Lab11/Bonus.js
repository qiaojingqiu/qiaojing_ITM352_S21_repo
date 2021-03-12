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