module.exports = function logger(req, res, next) {
  const time = new Date().toISOString();
  const started = process.hrtime.bigint();

  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - started) / 1e6;
    console.log(`[${time}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration.toFixed(2)} ms`);
  });

  next();
};
