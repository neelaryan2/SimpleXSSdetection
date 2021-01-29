# SimpleXSSdetection

All code done by me and my teammates as a part of CS741, Spring 2021, IIT Bombay CSE.  
CS741 : Advanced Network Security and Cryptography

A Google Chrome extension to detect and block XSS whole script injection.\
The requests supported are of two types: GET & POST form data.\
Only javascript based XSS is supported.

### Sample inputs:
```
<script> alert(); </script>
<  scRipT type="text/javascript">;</scriPt  >
```

### Team Members  -

Tathagat Verma - 180050111\
Pulkit Agrawal - 180050081\
[Neel Aryan Gupta](https://www.cse.iitb.ac.in/~neelaryan) - 180050067  
