# Merit

Given your scraping function, we call the function with web driver and timeout function. After the function returns, we quit web driver cleanly, because web driver sometimes leaves a zombie process. When timeout happens, zombie promise is killed, because the function is executed on subprocess and the process is killed.

# Usage

See test/test.js
