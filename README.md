# SimpleXSSdetection

All code done by me and my teammates as a part of CS741, Spring 2021, IIT Bombay CSE.  
CS741 : Advanced Network Security and Cryptography

We have built a Google Chrome extensions (with a basic toggle to turn it on/off) that has 2 major purposes:- 

### Detection and Blocking XSS whole script injection:

In this part, we developed an extension to detect and block XSS whole script injection. Currently, we support requests of two types: GET & POST form data, and only javascript based XSS is supported.

For implementing this, we monitor every request made by the webpage and scan the data in these requests looking for ```<script>``` tags using regex expressions. Whenever we find something malicious we block that request and thus prevent XSS script injection.


Sample inputs:
```
<script> alert(); </script>
<  scRipT type="text/javascript">;</scriPt  >
```

### Blocking Advertisement on a given Website:

In this part, we specify a particular website beforehand (here it is https://www.learncbse.in/), for which we will be blocking the advertisements.

On examining the website, we found that all advertisements are sent to URLs having "googleads.g.doubleclick.net/" as a part of them. So we block all requests to such URLs and thus prevent the ad from showing up.

### Team Members  -

[Neel Aryan Gupta](https://www.cse.iitb.ac.in/~neelaryan) - 180050067  
Pulkit Agrawal - 180050081\
Tathagat Verma - 180050111\
