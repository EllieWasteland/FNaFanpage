window.addEventListener("DOMContentLoaded", () => {
            const fechaObjetivo = new Date(2025, 3, 29).getTime(); // 29 de abril de 2026
            const uec = new UnixEpochalypseCountdown(".cd", fechaObjetivo);

            const infoBtn = document.getElementById("info-btn");
            if (infoBtn)
                infoBtn.addEventListener("click", jumpToHelp);
        });

        function jumpToHelp() {
            const info = document.getElementById("info");

            if (info) {
                window.scrollTo({
                    top: info.offsetTop,
                    left: 0,
                    behavior: "smooth"
                });
            }
        }

        class UnixEpochalypseCountdown {
            constructor(qs, targetTime) {
                this.el = document.querySelector(qs);
                this.time = [];
                this.animTimeout = null;
                this.updateTimeout = null;
                this.targetTime = targetTime;
                this.update();
            }

            getProgressInSeconds() {
    if (typeof moment === "function") {
        const now = moment().valueOf();
        const later = moment(this.targetTime).valueOf();
        const diff = Math.ceil((later - now) / 1e3);

        if(diff >= 0) {
            return diff;
        }else{
            return 0;
        }

    } else {
        return 0;
    }
}

            getTimeLeft() {
                let timeLeft = {
                    y: 0,
                    mo: 0,
                    d: 0,
                    h: 0,
                    m: 0,
                    s: 0
                };

                if (typeof moment === "function") {
                    const later = moment(this.targetTime);
                    const now = moment();
                    const diff = moment.duration(later.diff(now));

                    if (diff.valueOf() >= 0) {
                        timeLeft.y += diff.years();
                        timeLeft.mo += diff.months();
                        timeLeft.d += diff.days();
                        timeLeft.h += diff.hours();
                        timeLeft.m += diff.minutes();
                        timeLeft.s += diff.seconds();
                    } else {
                        timeLeft.y = 0;
                        timeLeft.mo = 0;
                        timeLeft.d = 0;
                        timeLeft.h = 0;
                        timeLeft.m = 0;
                        timeLeft.s = 0;
                    }
                }

                return timeLeft;
            }

            clearAnimations() {
                if (this.el) {
                    const colAnimsToClear = this.el.querySelectorAll("[data-col]");

                    Array.from(colAnimsToClear).forEach(a => {
                        a.classList.remove("cd__digit--roll-in");
                    });

                    const posAnimsToClear = this.el.querySelectorAll("[data-pos]");

                    Array.from(posAnimsToClear).forEach(a => {
                        a.classList.remove("cd__next-digit-fade", "cd__prev-digit-fade");
                    });
                }
            }

            update(doAnimations = false) {
                // start with all dashes
                if (!this.time.length) {
                    let digitCount = 12;

                    while (digitCount--)
                        this.time.push("-");
                }
                // update data
                const display = this.getTimeLeft();
                const displayDigits = [];

                for (let v in display) {
                    const digits = `${display[v]}`.split("");
                    // add zero to single digits
                    if (digits.length < 2)
                        digits.unshift("0");

                    displayDigits.push(...digits);
                }
                // update display
                const cols = this.el.querySelectorAll("[data-col]");

                if (cols) {
                    Array.from(cols).forEach((c, i) => {
                        const digit = displayDigits[i];

                        if (digit !== this.time[i]) {
                            const next = c.querySelector(`[data-pos="next"]`);
                            const prev = c.querySelector(`[data-pos="prev"]`);

                            if (doAnimations === true) {
                                c.classList.add("cd__digit--roll-in");
                                next.classList.add("cd__next-digit-fade");
                                prev.classList.add("cd__prev-digit-fade");
                            }

                            next.innerHTML = digit;
                            prev.innerHTML = this.time[i];
                        }
                    });
                }

                this.time = displayDigits;
                // progress in seconds
                const progress = this.el.querySelector("[data-progress]");

                if (progress)
                    progress.innerHTML = this.getProgressInSeconds();
                // loop
                clearTimeout(this.animTimeout);
                this.animTimeout = setTimeout(this.clearAnimations.bind(this), 500);

                clearTimeout(this.updateTimeout);
                this.updateTimeout = setTimeout(this.update.bind(this, true), 1e3);
            }
        }