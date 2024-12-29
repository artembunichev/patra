import {exstorageLS} from "./exstorage-ls"
import {exstorageNative} from "./exstorage-native"
import {isNative} from "./is-native"

export var exstorage = isNative()
	? exstorageNative
	: exstorageLS
