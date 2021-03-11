day = 27;
month = 'January';
year = 1999;
step1 = year - 1;
step2 = parseInt(step1/4) + step1;
step3 = step2 - parseInt(step1/100);
step4 = parseInt(step1/400) + step3;
step5 = day + step4;
monthKey = {
    'January': 0,
    'February': 3,
    'March': 2,
    'April': 5,
    'May': 0,
    'June': 3,
    'July': 5,
    'August': 1,
    'September': 4,
    'October': 6,
    'November': 2,
    'December': 4
};
step6 = step5 + (monthKey[month]);
step7 = step6%7;
daynumber = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
console.log(day + '-' + month + '-' + year + ',' + daynumber[step7]);