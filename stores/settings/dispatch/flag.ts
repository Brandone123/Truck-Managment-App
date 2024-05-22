import { defineStore } from 'pinia';

export interface FlagInfo {
    id: number
    name: string
    status: string
    warn_days_before: number | null
    warn_miles_before: number | null
    stop_days_before: number | null
    stop_miles_before: number | null

}

interface State {
    flagList: FlagInfo[]
}

export const useFlagStore = defineStore('flag', {
    state: (): State => ({
        flagList: [
            {
                id: 1,
                name: 'A Carrier Cargo Insurance Exp',
                status: 'ignore',
                warn_days_before: 10,
                warn_miles_before: 0,
                stop_days_before: 0,
                stop_miles_before: null,
            },
            {
                id: 2,
                name: 'Truck License Expired',
                status: 'ignore',
                warn_days_before: 0,
                warn_miles_before: 0,
                stop_days_before: 10,
                stop_miles_before: null,
            },
            {
                id: 3,
                name: 'Driver CDL Expires',
                status: 'ignore',
                warn_days_before: 0,
                warn_miles_before: 0,
                stop_days_before: 10,
                stop_miles_before: null,
            },
            {
                id: 4,
                name: 'Trailer License Expired',
                status: 'ignore',
                warn_days_before: 0,
                warn_miles_before: 0,
                stop_days_before: 10,
                stop_miles_before: null,
            },
            {
                id: 5,
                name: 'Truck Service Due',
                status: 'ignore',
                warn_days_before: 0,
                warn_miles_before: 0,
                stop_days_before: 10,
                stop_miles_before: null,
            },
            {
                id: 6,
                name: 'Trailer Service Due',
                status: 'ignore',
                warn_days_before: 0,
                warn_miles_before: 0,
                stop_days_before: 0,
                stop_miles_before: null,
            },

        ],
    }),

    getters: {
        getFlagList: (state) => { return state.flagList }
    },
    actions: {
        loadFlags() {
        },
        addFlag(flag:FlagInfo) {
            this.flagList.push(flag);
          },
          updateFlag(updateFlag: FlagInfo) {
            const index = this.flagList.findIndex((flag) => flag.id === updateFlag.id);
            if (index !== -1) {
              // Use Object.assign or the spread operator to merge the changes
              this.flagList[index] = Object.assign({}, this.flagList[index], updateFlag);
            } else {
              // Optionally handle the case where the flag isn't found
              console.error(`Flag with id ${updateFlag.id} not found.`);
            }
          },
          removeFlag(flagId:number) {
            this.flagList = this.flagList.filter(flag => flag.id !== flagId);
          }
    },
})
