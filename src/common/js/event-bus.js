
import Vue from 'vue';

const EventBus = new Vue();

EventBus.header = {
    citySwitch: 'HEADER_CITY_SWITCH'
};

EventBus.task = {
    intoEditor: 'TASK_INTO_EDITOR'
}

export default EventBus;