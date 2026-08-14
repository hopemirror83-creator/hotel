# Agoda Affiliate Lite API Notes

Source: `Affiliate_Lite_API_V2.0.pdf`

## Endpoint

- Main endpoint: `http://affiliateapi7643.agoda.com/affiliateservice/lt_v1`
- HTTPS endpoint also responds in the current environment: `https://affiliateapi7643.agoda.com/affiliateservice/lt_v1`

## Authentication

Every request must include:

- `Authorization: {siteid}:{apikey}`
- Body fields `siteid` and `apikey` with the same values

The request also supports compression headers:

- `Accept-Encoding: gzip,deflate`

## Request Shape

The Lite API does not support hotel-name keyword search. It requires one of:

- `criteria.cityId`
- `criteria.hotelId` as a list of integers

Example shape:

```json
{
  "siteid": "123456",
  "apikey": "00000000-0000-0000-0000-000000000000",
  "criteria": {
    "additional": {
      "currency": "KRW",
      "discountOnly": false,
      "language": "ko-kr",
      "occupancy": {
        "numberOfAdult": 2,
        "numberOfChildren": 0
      }
    },
    "checkInDate": "2026-07-26",
    "checkOutDate": "2026-07-27",
    "hotelId": [407854]
  }
}
```

## Next Required Data

For the first five Yeongjongdo hotels, add `agodaHotelId` values to `data/target-hotels.json`, or provide a reliable Incheon/Yeongjongdo `AGODA_CITY_ID` and filter returned hotels by name.
