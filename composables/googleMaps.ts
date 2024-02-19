import { ref } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
// import { MapOptions, Map, LatLngLiteral } from 'google.maps';
interface customControlButton {
    id: string;
    position: string;
}

type mapArguments = {
    customButtons: customControlButton[],
    mapContainerID: string,
    zoomControlsContainerID: string,
    index: string
}

type ControlPosition =
    | "TOP_LEFT"
    | "TOP_CENTER"
    | "TOP_RIGHT"
    | "LEFT_TOP"
    | "LEFT_CENTER"
    | "LEFT_BOTTOM"
    | "RIGHT_TOP"
    | "RIGHT_CENTER"
    | "RIGHT_BOTTOM"
    | "BOTTOM_LEFT"
    | "BOTTOM_CENTER"
    | "BOTTOM_RIGHT";

const loader = new Loader({
    apiKey: 'AIzaSyCnwkni9A9j10skcPro3kiefhsz62AoRFU',
    version: 'weekly',
    libraries: ['drawing', 'geometry', 'places'],
});

function map() {
    const featureOpts = [
        { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#dbdbdb" }] },
        { featureType: "water", elementType: "labels", stylers: [{ visibility: "on" }] },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.stroke",
            stylers: [{ visibility: "on" }, { color: "#ffffff" }, { weight: 0.1 }],
        },
        {
            featureType: "administrative.country",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ffffff" }, { weight: 0.1 }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [{ color: "#dbdbdb" }],
        },
        { featureType: "poi", elementType: "geometry.fill", stylers: [{ color: "#dbdbdb" }] },
        {
            featureType: "landscape.natural.terrain",
            elementType: "geometry",
            stylers: [{ visibility: "off" }],
        },
        {
            featureType: "landscape.natural",
            elementType: "geometry.fill",
            stylers: [{ color: "#ebebeb" }],
        },
        { featureType: "poi", elementType: "geometry.fill", stylers: [{ color: "#ebebeb" }] },
        {
            featureType: "administrative.neighborhood",
            elementType: "labels",
            stylers: [{ color: "#000000" }, { weight: 0.1 }],
        },
        {
            featureType: "administrative.province",
            elementType: "labels",
            stylers: [{ color: "#000000" }, { weight: 0.1 }],
        },
        { featureType: "road.highway", elementType: "labels", stylers: [{ visibility: "off" }] },
        {
            featureType: "transit",
            elementType: "geometry.fill",
            stylers: [{ visibility: "off" }, { color: "#ebebeb" }],
        },
        { featureType: "poi.park", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        {
            featureType: "poi.park",
            elementType: "labels.text",
            stylers: [{ color: "#000000" }, { weight: 0.1 }],
        },
        { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#dbdbdb" }] },
        {
            featureType: "road.highway.controlled_access",
            elementType: "geometry.fill",
            stylers: [{ color: "#b0b0b0" }],
        },
        {
            featureType: "road.highway.controlled_access",
            elementType: "geometry.stroke",
            stylers: [{ visibility: "off" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ visibility: "simplified" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [{ color: "#b0b0b0" }],
        },
        { featureType: "landscape.man_made", elementType: "all", stylers: [{ color: "#ebebeb" }] },
        {
            featureType: "administrative.locality",
            elementType: "labels",
            stylers: [{ color: "#000000" }],
        },
        {
            featureType: "road",
            elementType: "labels.icon",
            stylers: [{ visibility: "on" }, { saturation: -100 }],
        },
        { featureType: "all", elementType: "labels.icon", stylers: [{ saturation: -100 }] },
        { featureType: "all", elementType: "labels", stylers: [{ saturation: -100 }] },
    ]

    const US_MAP_CENTER: google.maps.LatLngLiteral = {
        lat: 33.2202301,
        lng: -96.9318577,
    }

    // Define the mapOptions variable as a Ref<MapOptions | undefined>
    const mapOptions = ref<google.maps.MapOptions | undefined>();

    const map = ref<google.maps.Map | undefined>();

    function displayMap(mapContainerID: string, index: string): void {
        mapOptions.value = {
            center: US_MAP_CENTER,
            zoom: 4,
            maxZoom: 25,
            minZoom: 1,
            zoomControl: false,
            draggable: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            restriction: {
                latLngBounds: {
                    north: 49.382808,
                    south: 24.521208,
                    east: -66.945392,
                    west: -124.736342,
                },
            },
        }

        let mapElement = document.getElementById(mapContainerID + index) as HTMLElement
        if (!mapElement) {
            return
        }

        map.value = new google.maps.Map(
            mapElement,
            {
                ...mapOptions.value,
            })
    }

    function initMap(buttons: customControlButton[], mapContainerID: string, zoomControlsContainerID: string, index: string) {

        displayMap(mapContainerID, index)

        let zoomControlButtons = document.getElementById(zoomControlsContainerID + index) as HTMLElement | null
        if (zoomControlButtons != null) {
            addControlButton('RIGHT_BOTTOM', zoomControlButtons);
            zoomControl(index)
            zoomControlButtons.style.display = 'block';
        }

        buttons.forEach((button) => {
            let controlButton = document.getElementById(button.id) as HTMLElement | null
            if (controlButton != null && button.position) {
                addControlButton(button.position as ControlPosition, controlButton)
                controlButton!.style.display = 'block'
            }
        })
    }

    function zoomControl(index: string): void {
        var zoomIn = document.getElementById('zoomIn' + index);
        var zoomOut = document.getElementById('zoomOut' + index);
        var center = document.getElementById('center' + index)

        google.maps.event.addDomListener(zoomOut as Object, 'click', function () {
            if(typeof map.value != 'undefined'){
                var currentZoomLevel = map.value.getZoom();
                if (currentZoomLevel != 0 && typeof currentZoomLevel != 'undefined') {
                    map.value.setZoom(currentZoomLevel - 1);
                } 
            }
           
        });

        google.maps.event.addDomListener(zoomIn as Object, 'click', function () {
            if (typeof map.value != 'undefined') {
                var currentZoomLevel = map.value.getZoom() || 0;
                if (currentZoomLevel != 21) {
                    map.value.setZoom(currentZoomLevel + 1);
                }
            }

        });

        google.maps.event.addDomListener(center as Object, 'click', function () {
            if (typeof map.value != 'undefined' && typeof mapOptions.value != 'undefined') {
                map.value.setZoom(mapOptions.value.zoom as number);
                map.value.panTo(US_MAP_CENTER);
            }
        });
    }

    function addControlButton(position: ControlPosition, element: HTMLElement): void {
        if (typeof map.value != 'undefined') {
            map.value.controls[google.maps.ControlPosition[position]].push(element);
        }
    };

    function renderMap({ customButtons, mapContainerID, zoomControlsContainerID, index, }: mapArguments): void {
        // hackMap()
        loader.load().then(() => {
            // Initialize the map here
            initMap(customButtons, mapContainerID, zoomControlsContainerID, index)
        }).catch((e: any) => {
            // Handle map loading error
        });
    };

    return {
        renderMap
    }
}

export default function googleMaps() {
    const instance = map();
    return instance
}
