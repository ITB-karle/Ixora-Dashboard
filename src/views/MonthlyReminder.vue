<script setup>
import { ref, reactive, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { createEventId } from '../assets/js/event-utils';
import { apiRequest } from '@/assets/js/apiRequest.js';
// import GlobeComponent from '../examples/Globe.vue';

const monthMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const calendarOptions = reactive({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
  ],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  initialView: 'dayGridMonth',
  events: [],
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: false,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  datesSet: handleDatesSet,
});


const patient_reminder = ref([]);
const form = ref([]);
const currentEvents = ref([]);

onMounted(() => {
  logCurrentMonth();  // Log the initial month and fetch data
});

const getMonthlyReminder = async (year, month) => {
  const data = { year, month };
  try {
    console.log(`Fetching reminders for Year ${year}, Month ${month}`);
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_reminder/monthly`, data);
    patient_reminder.value = response.data;
    form.value = { ...response.data };
    setCalendarEvents(patient_reminder.value);
  } catch (error) {
    console.error('Get Data Failed:', error);
  }
};

const setCalendarEvents = (reminders) => {
  console.log(1);
  const events = reminders.map(reminder => ({
    id: createEventId(),
    title: reminder.reminder,
    start: reminder.date_from,
    end: reminder.date_to,
    allDay: reminder.allDay,
  }));
  calendarOptions.events = events;
};

function handleDateSelect(selectInfo) {
  console.log(2);
  let title = prompt('Please enter a new title for your event');
  let calendarApi = selectInfo.view.calendar;

  calendarApi.unselect();

  if (title) {
    calendarApi.addEvent({
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });
  }
}

function handleDatesSet() {
  console.log(4);
  logCurrentMonth();
}

function handleEventClick(clickInfo) {
  console.log(3);
  if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    clickInfo.event.remove();
  }
}

function handleEvents(events) {
  console.log(5);
  currentEvents.value = events;
}

function logCurrentMonth() {
  const calendarTitle = document.querySelector('.fc-toolbar-title');
  if (calendarTitle) {
    const titleText = calendarTitle.textContent;
    const [monthName, year] = titleText.split(' ');
    const monthNumber = monthMap[monthName];
    console.log(`Current view month: ${monthName} (${monthNumber})`);
    getMonthlyReminder(year, monthNumber);
  }
}
</script>

<template>
  <div class='demo-app'>
    <div class='demo-app-main bg-light'>
      <FullCalendar
        class='demo-app-calendar'
        :options='calendarOptions'
      >
        <template v-slot:eventContent='arg'>
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
<!-- 
      <GlobeComponent width="800" height="600" /> -->
    </div>
  </div>
</template>

<style lang='css'>
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc {
  max-width: 95%;
  margin: 0 4rem;
}
</style>

<!-- <script setup>
import { ref, onMounted } from 'vue'
import ArgonButton from "@/components/ArgonButton.vue";
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { apiRequest } from '@/assets/js/apiRequest.js';

const monthMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

var calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  dateClick: handleDateClick,
  datesSet: handleDatesSet,
  // dayMaxEventRows: true,  // for all non-TimeGrid views
  // views: {
  //   timeGrid: {
  //     dayMaxEventRows: 6 // adjust to 6 only for timeGridWeek/timeGridDay
  //   }
  // },
  events: [],
})

function handleDateClick(arg) {
  alert('date click! ' + arg.dateStr)
}


onMounted(() => {
  logCurrentMonth();  // Log the initial month and fetch data
});

function logCurrentMonth() {
  const calendarTitle = document.querySelector('.fc-toolbar-title');
  if (calendarTitle) {
    const titleText = calendarTitle.textContent;
    const [monthName, year] = titleText.split(' ');
    const monthNumber = monthMap[monthName];
    console.log(`Current view month: ${monthName} (${monthNumber})`);
    getMonthlyReminder(year, monthNumber);
  }
}

const patient_reminder = ref([]);
const form = ref([]);

const getMonthlyReminder = async (year, month) => {
  const data = { year, month };
  try {
    console.log(`Fetching reminders for Year ${year}, Month ${month}`);
    const response = await apiRequest(`https://staging.itbrightsolution.com/ixora_backend/public/api/v1/patient_reminder/monthly`, data);
    patient_reminder.value = response.data;
    form.value = { ...response.data };
    setCalendarEvents(patient_reminder.value);      
  } catch (error) {
    console.error('Get Data Failed:', error);
  }
};

function handleDatesSet() {
  logCurrentMonth();
  // let title = prompt("Please enter a new title for your event");
  //     let calendarApi = selectInfo.view.calendar;

  //     calendarApi.unselect(); // clear date selection

  //     if (title) {
  //       calendarApi.addEvent({
  //         title,
  //         start: selectInfo.startStr,
  //         end: selectInfo.endStr,
  //         allDay: selectInfo.allDay,
  //       });
  //     }
      // logCurrentMonth();
}

const setCalendarEvents = (reminders) => {  
  const events = reminders.map(reminder => ({
    id: reminder.uuid,
    title: reminder.reminder,
    start: reminder.date_from,
    end: reminder.date_to,
    allDay: reminder.allDay,
  }));
  calendarOptions.value.events = events;
};
</script>
<template>
  <div>
    <div class="text-end me-5 mb-3">
      <a
        :href="`../create-notification`"
      >
        <argon-button >Add</argon-button>
      </a>
    </div>
    
    <FullCalendar :options="calendarOptions" class="calendar bg-light rounded p-4 mx-auto w-100">
      <template v-slot:eventContent='arg'>
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
  </div>
</template>

<style>
.calendar {
  font-size: 14px;
}
</style> -->