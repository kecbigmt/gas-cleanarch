import { type ISO8601DateString } from '@/domain';

const googleSheetsEntrance = {
    toISO8601DateString: (dateStr: string): ISO8601DateString => {
        const d = new Date(dateStr);
        const yyyy = d.getFullYear();
        const MM = ("0" + (d.getMonth() + 1)).slice(-2);
        const dd = ("0" + d.getDate()).slice(-2);
        return `${yyyy}-${MM}-${dd}`;
    },
};

export default googleSheetsEntrance;
