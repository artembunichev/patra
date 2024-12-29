var { BrowserWindow, app, ipcMain } = require('electron')
var path = require('path')
var fs = require( 'fs')

var mainWindow
app.on("ready", ()=> {
	mainWindow = new BrowserWindow( {
	titleBarStyle: 'hidden',
	webPreferences: {
		nodeIntegration: true,
		contextIsolation: false,
		preload: path.join( __dirname, 'preload.js' ),
	}
} )

mainWindow.setFullScreen( true )
mainWindow.removeMenu()

mainWindow.loadFile( path.join( __dirname, '../index.html' ) )

mainWindow.on( 'closed', () => {
	mainWindow = null
} )
})

var appDataFilename = 'data.json'

var userDataPath = app.getPath( 'userData' )
var pathToAppData= `${ userDataPath }/${ appDataFilename }`

ipcMain.on( 'checkIfAppDataFileExists', ( event ) => {
	var fileExists = fs.existsSync( pathToAppData )
	event.returnValue = fileExists
} )

ipcMain.on( 'setAppDataToFileSync', ( _, data ) => {
	fs.writeFileSync( pathToAppData, data, {
		encoding: 'utf-8',
	} )
} )

ipcMain.on( 'getAppData', ( event ) => {
	const content = fs.readFileSync( pathToAppData, { encoding: 'utf-8' } )
	event.returnValue = content
} )
