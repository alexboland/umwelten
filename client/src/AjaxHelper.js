export function getVolumeInfo(volumeUuid) {
  return fetch('/volumes/basicInfo' + volumeUuid).then(results => results.json())
}