import googleMaps from '@/composables/googleMaps'
import type { LoadInfo } from '~/types/dispatch/load'
import { storeToRefs } from 'pinia'

export default async function renderMap(loadInfo: LoadInfo, mapContainerId: string, mapindex: string) {
  const nuxtApp = useNuxtApp()

  // wrap composable execution in nuxt context
  return nuxtApp.runWithContext(async () => {
    let loadStore = useLoadStore()

    const { loadRoutes } = storeToRefs(loadStore)

    let mapInstance = await googleMaps.init()
    mapInstance.renderMap({
      customButtons: [{ id: 'etaDisplay', position: 'RIGHT_TOP' }, { id: 'detailsDisplay', position: 'LEFT_TOP' }],
      mapContainerID: mapContainerId, //'map',
      zoomControlsContainerID: 'zoomControls',
      index: mapindex //'',
    })

    let route = loadRoutes.value.find(route => route.route_number == loadInfo.route_number)

    if (!route) {
      //get route information
      const { data: directionsData, error: directionsError } = await loadStore.findLoadRouteByNumber(loadInfo.route_number as string, loadInfo.id as number)
      if (!directionsData) {

        let waypoints: google.maps.DirectionsWaypoint[] = []
        const sortedStops = loadInfo.stops.slice().sort((stopA, stopB) => stopA.sequence - stopB.sequence);
        sortedStops.slice(1, -1).forEach((stop, index) => {
          waypoints.push({
            location: `${stop.location?.AddressLine}, ${stop.location.City}, ${stop.location.State}`,
            stopover: true,
          })
        })

        let routeRequestData: google.maps.DirectionsRequest = {
          travelMode: 'DRIVING',
          origin: `${sortedStops[0].location?.AddressLine}, ${sortedStops[0].location.City}, ${sortedStops[0].location.State}`,
          destination: `${sortedStops[sortedStops.length - 1].location?.AddressLine}, ${sortedStops[sortedStops.length - 1].location.City}, ${sortedStops[sortedStops.length - 1].location.State}`,
          waypoints: waypoints.length > 0 ? waypoints : undefined
        } as google.maps.DirectionsRequest


        const { data: directionsResponse, error: directionsResponseError } = await mapInstance.directionService(routeRequestData)

        if (directionsResponse) {
          // save to database
          loadStore.createLoadRoute({ route_number: loadInfo.route_number, directions: directionsResponse })

          //render on map
          mapInstance.directionsRenderer(directionsResponse)
        }
      }

      else {
        mapInstance.directionsRenderer(directionsData.directions as google.maps.DirectionsResult)
      }

    } else {
      mapInstance.directionsRenderer(route.directions as google.maps.DirectionsResult)
    }

    return mapInstance
  })

}