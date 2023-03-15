"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
let brewData = [];
const API_KEY = "ae3ae74a-c1ac-11ed-a138-0242ac130002-ae3ae84e-c1ac-11ed-a138-0242ac130002"; // Replace with your own API key
app.get("/api", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const city = "san_diego";
    const url = `https://api.openbrewerydb.org/breweries?by_city=${city}`;
    try {
        const response = yield axios_1.default.get(url);
        const data = response.data;
        if (Array.isArray(data) &&
            data.every((item) => typeof item === "object" && item !== null)) {
            brewData = data;
            try {
                yield axios_1.default.get("http://localhost:5001/api/temperature"); // This will update brewData
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ message: "Error fetching temperature data" });
            }
            res.send(brewData);
        }
        else {
            throw new Error("Invalid data format");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching breweries" });
    }
}));
app.get("/api/temperature", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        for (const brewery of brewData) {
            const { longitude, latitude } = brewery;
            const url = `https://api.stormglass.io/v2/weather/point?lat=${latitude}&lng=${longitude}&params=airTemperature`;
            const headers = { Authorization: API_KEY };
            const response = yield axios_1.default.get(url, { headers });
            const data = response.data;
            const currentTemperature = (_e = (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.hours) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.airTemperature) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : "N/A";
            brewery.degreesCelcius = currentTemperature;
        }
        res.send(brewData);
    }
    catch (error) {
        console.error(error + ' Error fetching temperature data');
        res.send(brewData);
    }
}));
app.listen("5001", () => {
    console.log("server listening to your soul on port 5001 :)");
});
//# sourceMappingURL=app.js.map