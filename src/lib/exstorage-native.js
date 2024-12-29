export class ExstorageNative {	
	save(data) {
		var str = JSON.stringify(data)
		window.ipcRenderer.sendSync( 'setAppDataToFileSync', str )
	}
	get() {
		const isDataFileExists = window.ipcRenderer.sendSync(
			'checkIfAppDataFileExists',
		)
		
		if (!isDataFileExists) {
			return null
		}
		
		return JSON.parse(
			window.ipcRenderer.sendSync( 'getAppData' )
		)
	}
}

export var exstorageNative = new ExstorageNative
