module.exports = {
    parse: parse
};


/*parse returns an object with "type" and "schedule" keys. "type" is a string representing
the type of regulation, and "schedule" is an object with keys for each day of the week
and values of the start and end times that parking is prohibited on those days*/
function parse(desc) {
    if (!desc)
        return {type: null, schedule: null};
    removeTypos(desc);
    removeJunk(desc);
    return getDetails(desc);
}

function getDetails(desc) {
    var match = desc.match(/NO PARKING *(.*)/i);
    if (match)
        return parseNoParking(match[1]);
    match = desc.match(/NO STANDING/i)
    if (match)
        return parseNoStanding(desc);
    match = desc.match(/NO STOPPING *(.*)/i)
    if (match)
        return parseNoStopping(match[1]);
    match = desc.match(/BUS STOP *(.*)/i);
    if (match)
        return parseBusStop(match[1]);
    if (desc.match(/^([0-9\/]+) *H(OU)?R\.? *(METERED|MUNI-METER)? *PARKING */i)
        || desc.match(/^([0-9\/]+) *HMP */i)) {
        var schedule = parseTimePeriods(desc);
        return {type: "METER", schedule: schedule};
    }
    return {
        type: "UNKNOWN",
        schedule: null
    };
}

function parseNoParking(desc) {
    var type = "NO PARKING";
    var match = desc.match(/\((SANITATION )?BROOM SYMBOL\)/i);
    if (match) {
        type = "STREET CLEANING";
    }
    match = desc.match(/\(SANITATION SYMBOL\) *(.*)/i);
    if (match) {
        type = "STREET CLEANING";
    }
    var schedule = parseTimePeriods(desc);
    return {
        type: type,
        schedule: schedule
    };
}

function parseNoStanding(desc) {
    var days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    if (desc.match(/HANDICAP BUS/))
        return {type: "BUS INFO", schedule: null};
    var schedule = parseTimePeriods(desc);
    if (desc.match(/FIRE ZONE/) || desc.match(/NO STANDING( W\/ SINGLE ARROW)?$/)) {
        days.forEach(function(day) {
            schedule[day] = ["12AM", "12AM"];
        });
    }
    return {type: "NO STANDING", schedule: schedule};
}

function parseNoStopping(desc) {
    var schedule = parseTimePeriods(desc);
    return {type: "NO STOPPING", schedule: schedule};
}

function parseBusStop(desc) {
    return {type: "BUS STOP", schedule: null};
}

function parseTimePeriods(desc) {
    var days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    var schedule = {
        "MON": [],
        "TUE": [],
        "WED": [],
        "THU": [],
        "FRI": [],
        "SAT": [],
        "SUN": []
    };
    if (desc.match(/^ANYTIME/i)) {
        days.forEach((day) => schedule[day] = ["12AM", "12AM"]);
        return schedule;
    }
    var dayRE = /MON|TUE|WED|THU|FRI|SAT|SUN/ig;
    var timeRE = /((\d\d?)(:(\d\d))? *([AP]M)|NOON|MIDNIGHT)/ig;
    var intervalRE = /(((\d\d?)(:(\d\d))? *(([AP]M)|NOON|MIDNIGHT)?)) *(THRU|-|TO) *(((\d\d?)(:(\d\d))? *([AP]M)|NOON|MIDNIGHT))/i;
    var hasTime = timeRE.test(desc);
    var hasDay = dayRE.test(desc);
    var npDays = desc.match(dayRE);
    var npTimes = [];
    if (/(MON(DAY)?|TUE(SDAY)?|WED(SDAY)?|THU(RSDAY)?|FRI(DAY)?|SAT(URDAY)?|SUN(DAY)?) *((THRU)|\-)/.test(desc)) {
        var first = days.indexOf(npDays[0]);
        var second = days.indexOf(npDays[1]);
        for (var i = first + 1; i < second; i++)
            npDays.push(days[i]);
    }
    if (/SCHOOL DAYS/.test(desc))
        npDays = ["MON", "TUE", "WED", "THU", "FRI"];
    if (/EXCEPT SUNDAY/.test(desc))
        npDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
    if (intervalRE.test(desc)) {
        var match = desc.match(intervalRE);
        var t0 = match[1];
        var t1 = match[9];
        if (!match[7])
          t0 += match[14];
        npTimes.push(t0);
        npTimes.push(t1);
    }
    if (npDays)
        npDays.forEach((day) => schedule[day] = npTimes);
    return schedule;
}

function removeTypos(desc) {
    desc.replace(/NP PARKING/g, "NO PARKING");
    desc.replace(/ F RI /g, " FRI ");
    desc.replace(/HOILDAY/g, "HOLIDAY");
    desc.replace(/SIGNLE/g, "SINGLE");
    desc.replace(/SYBBOL/g, "SYMBOL");
    desc.replace(/BROON /g, "BROOM ");
    desc.replace(/BRROM /g, "BROOM ");
    desc.replace(/PARKIGN/g, "PARKING");
    desc.replace(/PKNG/g, "PARKING");
    desc.replace(/12 NOON/g, "NOON");
    desc.replace(/SANI-TATION/g, "SANITATION");
    desc.replace(/NOON 1:3-PM/g, "NOON TO 1:30PM");
    desc.replace(/8AM 11AM/g, "8AM TO 11AM");
    desc.replace(/^NO PARKING \(SANITATION BROOM SYMBOL\) 9-10:30AM W\/SINGLE ARROW$/g, 
        "NO PARKING (SANITATION BROOM SYMBOL) 9-10:30AM THURS W/SINGLE ARROW");
    desc.replace(/^NO PARKING \(SANITATION BROOM SYMBOL\) 7:30-8AM W\/SINGLE ARROW/g, 
        "NO PARKING (SANITATION BROOM SYMBOL) 7:30-8AM WED W/SINGLE ARROW");
}

function removeJunk(desc) {
    desc.replace(/\(?SUPE?RSEDE.*/, "");
    desc.replace(/\(?REPLACE.*/g, "");
    desc.replace(/\(USE .*/g, "");
    desc.replace(/\(DON'T LITTER\) */g, "");
    desc.replace(/\(SEE .*/g, "");
    desc.replace(/\(NOTE.* .*/g, "");
    desc.replace(/\(?REVISED.*/g, "");
    desc.replace(/\(? ?SIGN TO BE .*/g, "");
    desc.replace(/W?\/? *\(?(SINGLE )?(HEAD )?ARROW\)?/g, "");
    desc.replace(/BUS LAYOVER AREA /g, "");
    desc.replace(/ +$/g, "");
}


