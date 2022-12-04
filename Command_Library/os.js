const os = require('os');
let timesBefore = os.cpus().map(c => c.times);

module.exports = {
  getAverageUsage() {
    let timesAfter = os.cpus().map(c => c.times);
    let timeDeltas = timesAfter.map((t, i) => ({
      user: t.user - timesBefore[i].user,
      sys: t.sys - timesBefore[i].sys,
      idle: t.idle - timesBefore[i].idle
    }));

    timesBefore = timesAfter;

    return timeDeltas
      .map(times => 1 - times.idle / (times.user + times.sys + times.idle))
      .reduce((l1, l2) => l1 + l2) / timeDeltas.length;
  },
}