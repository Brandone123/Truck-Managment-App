import { Loader } from '@googlemaps/js-api-loader';
interface CustomControlButton {
  id: string;
  position: string;
}

interface MapArguments {
  customButtons: CustomControlButton[];
  mapContainerID: string;
  zoomControlsContainerID: string;
  index: string;
}

interface MarkerDataOptions {
  backgroundColor: string;
}

interface Marker {
  position: google.maps.LatLng; index: number[]
}

interface MarkerAddress extends Marker {
  address: string;
}

type ControlPosition =
  | 'TOP_LEFT'
  | 'TOP_CENTER'
  | 'TOP_RIGHT'
  | 'LEFT_TOP'
  | 'LEFT_CENTER'
  | 'LEFT_BOTTOM'
  | 'RIGHT_TOP'
  | 'RIGHT_CENTER'
  | 'RIGHT_BOTTOM'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_CENTER'
  | 'BOTTOM_RIGHT';

class GoogleMap {
  private loader: Loader;
  private mapOptions: google.maps.MapOptions | undefined;
  public map: google.maps.Map | undefined;

  private MAP_CENTER: google.maps.LatLngLiteral = {
    lat: 33.2202301,
    lng: -96.9318577,
  };  //US_MAP_CENTER as default

  constructor(loader: Loader) {
    this.loader = loader
    // new Loader({
    //   apiKey: apiKey,
    //   version: 'weekly',
    //   libraries: ['drawing', 'geometry', 'places', 'routes', 'marker'],
    // });
  }

  // factory used to initialize class from async data
  static async init() {
    const config = useRuntimeConfig()
    const loader = new Loader({
      apiKey: config.public.googleMapsApi || '',
      version: 'weekly',
      libraries: ['drawing', 'geometry', 'places', 'routes', 'marker'],
    });

    console.log('window.google is: ')
    console.log(window.google)

    if (!window.google) {
      await loader.load()
    }

    return new GoogleMap(loader)
  }

  private displayMap(mapContainerID: string, index: string): void {
    this.mapOptions = {
      center: this.MAP_CENTER,
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
    };

    const mapElement = document.getElementById(mapContainerID + index) as HTMLElement;
    if (!mapElement) {
      return;
    }

    this.map = new google.maps.Map(mapElement, {
      ...this.mapOptions,
    });
  }

  private zoomControl(index: string): void {
    const zoomIn = document.getElementById('zoomIn' + index);
    const zoomOut = document.getElementById('zoomOut' + index);
    const center = document.getElementById('center' + index);

    google.maps.event.addDomListener(zoomOut as Object, 'click', () => {
      if (typeof this.map !== 'undefined') {
        const currentZoomLevel = this.map.getZoom();
        if (currentZoomLevel !== 0 && typeof currentZoomLevel !== 'undefined') {
          this.map.setZoom(currentZoomLevel - 1);
        }
      }
    });

    google.maps.event.addDomListener(zoomIn as Object, 'click', () => {
      if (typeof this.map !== 'undefined') {
        const currentZoomLevel = this.map.getZoom() || 0;
        if (currentZoomLevel !== 21) {
          this.map.setZoom(currentZoomLevel + 1);
        }
      }
    });

    google.maps.event.addDomListener(center as Object, 'click', () => {
      if (
        typeof this.map !== 'undefined' &&
        typeof this.mapOptions !== 'undefined'
      ) {
        this.map.setZoom(this.mapOptions.zoom as number);
        this.map.panTo(this.MAP_CENTER);
      }
    });
  }

  private addControlButton(position: ControlPosition, element: HTMLElement): void {
    if (typeof this.map !== 'undefined') {
      this.map.controls[google.maps.ControlPosition[position]].push(element);
    }
  }

  public renderMap({
    customButtons,
    mapContainerID,
    zoomControlsContainerID,
    index,
  }: MapArguments): void {
    this.displayMap(mapContainerID, index);

    const zoomControlButtons = document.getElementById(
      zoomControlsContainerID + index
    ) as HTMLElement | null;

    if (zoomControlButtons !== null) {
      this.addControlButton('RIGHT_BOTTOM', zoomControlButtons);
      this.zoomControl(index);
      zoomControlButtons.style.display = 'block';
    }

    customButtons.forEach((button) => {
      const controlButton = document.getElementById(button.id) as
        | HTMLElement
        | null;

      if (controlButton !== null && button.position) {
        this.addControlButton(button.position as ControlPosition, controlButton);
        controlButton.style.display = 'block';
      }
    });
  }

  public SvgToBase64Image(svgCode: string) {
    const base64 = btoa(svgCode);
    return `data:image/svg+xml;base64,${base64}`;
  }

  private getMarkerUrl(markerText: string | number, options = { backgroundColor: '#1866c0' } as MarkerDataOptions) {
    // Create a custom pin element
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
              <style>
                circle {
                  fill: ${options?.backgroundColor};
                  transition: fill 0.3s ease;
                }
          
                svg:hover circle {
                  fill: #4caf4f;
                }
                text{
                  font-family: "Roboto", sans-serif;
                  font-size: 80px;
                }
              </style>
          
              <circle cx="100" cy="100" r="90" />
              <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" fill="white" font-size="48">
                ${markerText}
              </text>
            </svg>`;

    return {
      url: this.SvgToBase64Image(svgCode),
      scaledSize: new google.maps.Size(30, 30)
    }
  }

  public setMarkers(directions: google.maps.DirectionsResult) {
    let _this = this

    let markers: MarkerAddress[] = []
    const route = directions?.routes[0]
    const stopsCount: number = directions?.geocoded_waypoints?.length || 0
    const startDirection = route.legs[0].start_location;
    // plotMarker(startDirection, 1)
    markers.push({ position: startDirection, address: route.legs[0].start_address, index: [1] })
    const endDirection = route.legs[route.legs.length - 1].end_location;
    // plotMarker(endDirection, stopsCount)
    markers.push({ position: endDirection, address: route.legs[route.legs.length - 1].end_address, index: [stopsCount] })

    if (stopsCount > 2) {
      directions?.routes[0].legs.slice(1).forEach((leg, index) => {
        // plotMarker(leg.start_location, index+2)
        markers.push({ position: leg.start_location, address: leg.start_address, index: [index + 2] })
      })
    }

    const mergedArray = Object.values(
      markers.reduce((acc: { [key: string]: { position: google.maps.LatLng; address: string; index: number[] } }, { position, address, index }) => {
        const key: string = address;
        if (!acc[key]) {
          acc[key] = { position, address, index }; // Initialize the entry if it doesn't exist
        } else {
          acc[key].index = acc[key].index.concat(index); // Merge index arrays for the same data value
        }
        return acc;
      }, {})
    );

    //plot markers
    mergedArray.forEach((marker: MarkerAddress) => {
      //markers are sorted in increasing order before being joint
      plotMarker(marker, marker.index.sort((a, b) => a - b).join(','))
    })

    function plotMarker(markerData: MarkerAddress, index: string) {
      let markerImage = _this.getMarkerUrl(index)
      let hoveredMarkerImage = _this.getMarkerUrl(index, { backgroundColor: '#4caf4f' })

      const addressInfo = markerData.address.split(',').map(item => `<span>${item}</span><br>`).join('');

      let infoWindow = new google.maps.InfoWindow({
        content: `<div style="font-weight:bold;">${addressInfo}</div>`
      })
      let marker = new google.maps.Marker({
        position: markerData.position,//{ lat: 37.7749, lng: -122.4194 },
        map: _this.map,
        icon: markerImage
      })
      // Add event listeners for hover effect
      marker.addListener('mouseover', () => {
        marker.setIcon(hoveredMarkerImage)
        infoWindow.open({
          anchor: marker,
          map: _this.map,
        })
      })

      marker.addListener("mouseout", function () {
        marker.setIcon(markerImage);
        infoWindow.close()
      });
    }
  }

  public directionsRenderer(directions: google.maps.DirectionsResult) {

    let directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map, // Set the map for the renderer
      suppressMarkers: true // Disable the default markers for waypoints
    });

    directionsRenderer.setDirections(directions);

    // Create a marker with a custom pin
    this.setMarkers(directions)

    this.setZoom(25)
    this.panTo?.(directions?.routes[0].legs[0].start_location as any)
  }

  public setZoom(zoom: number): void {
    this.map?.setZoom(zoom)
  }

  public panTo(point: google.maps.LatLngLiteral): void {
    this.map?.panTo(point);
  }

  async directionService(request: google.maps.DirectionsRequest) {
    return new Promise<{ data?: google.maps.DirectionsResult, error?: boolean, }>((resolve, reject) => {
      new google.maps.DirectionsService().route(request, (response: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
        if (status === google.maps.DirectionsStatus.OK) {
          // Directions request successful, handle the response
          // console.log('Directions: ', response?.routes[0].legs);
          resolve({ data: response as google.maps.DirectionsResult });
        } else {
          // Directions request failed
          reject({ error: status });
        }
      });
    });
  }
}

export default GoogleMap;