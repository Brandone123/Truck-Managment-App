<template>
    <div>
        <v-btn @click="openPopup">Add Item</v-btn>
    </div>
</template>
  
<script type="ts">
import { ref, createApp, h, getCurrentInstance } from 'vue';
//import Loads from '@/components/dispatch/Loads.vue'

export default {
    setup() {

        const app = ref(null)
        onMounted(() => {
            app.value = getCurrentInstance();
        });

        const openPopup = () => {
            // const popupWidth = 400;
            // const popupHeight = 300;

            // const parentWindow = window;
            // const parentWidth = parentWindow.innerWidth;
            // const parentHeight = parentWindow.innerHeight;
            // const parentTop = parentWindow.screenY || parentWindow.screenTop;
            // const parentLeft = parentWindow.screenX || parentWindow.screenLeft;

            // const popupTop = parentTop + (parentHeight - popupHeight) / 2;
            // const popupLeft = parentLeft + (parentWidth - popupWidth) / 2;

            // const popup = window.open(
            //     '',
            //     '_blank',
            //     `width=${popupWidth},height=${popupHeight},top=${popupTop},left=${popupLeft}`
            // );

            // popup.document.write('<div id="app"><span>this is a dialog element</span></div>');

            // import('@/components/dispatch/Loads.vue').then((module) => {
            //     const AddLoadComponent = module.default;
            //     const app = createApp({
            //         // ...nuxtConfig,
            //         render: () => h(AddLoadComponent),
            //         methods: {
            //             // itemAdded(newItem) {
            //             //     // Handle the added item in the parent Vue component
            //             //     console.log('Added item:', newItem);
            //             //     popup.close();
            //             // },
            //         },
            //     });

            //     // app.component('add-load-component', AddLoadComponent)
            //     app.mount(popup.document.getElementById('app'));
            // });

            // console.log(app)

            // const newApp = createApp({
            //     render: () => h(Loads),// h(Loads),
            // });

            // newApp.config.globalProperties = { ...app.config.globalProperties };
            // newApp.mixin(app.mixin);
            // newApp.use(app.value.parent.proxy.$vuetify);
            // newApp.use(app.value.proxy.$vuetify);
            // newApp.component(app.component);



            // newApp.use(app.proxy.$vuetify)
            // newApp.mount(popup.document.getElementById('app'));

            // const popupWindow = window.open('', '_blank', 'width=500,height=500');

            // popupWindow.document.write('<div id="app"><span>this is a dialog element</span></div>');

            // // Wait for the popup window to load
            // popupWindow.addEventListener('load', () => {
            //     // Create a new Vue app and mount the PopupContent component inside the popup window
            //     const app = createApp(Loads);
            //     app.mount(popup.document.getElementById('app'));
            // });

            const popupWindow = window.open('/detachedFlags', '_blank', 'width=500,height=500');

            // Wait for the popup window to load
            popupWindow.addEventListener('load', () => {
                // Optionally, you can pass data to the popup component via the URL query parameters
                // const queryParams = new URLSearchParams();
                // queryParams.set('param1', 'value1');
                // queryParams.set('param2', 'value2');
                // popupWindow.location.search = queryParams.toString();

                // You can also pass data through the window object
                // popupWindow.myData = { key: 'value' };
            });
        };

        return {
            openPopup
        };
    }
};

</script>