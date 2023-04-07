import db from "../models/index";
import bcrypt from 'bcryptjs';
require('dotenv').config()
import { v4 } from "uuid"
import { generateCode, getNumberFromString, getNumberFromStringAcreage, getNumberFromStringPrice } from '../utils/fn'
import chothuematbang from '../../data/chothuematbang.json'
import chothuecanho from '../../data/chothuecanho.json'
import nhachothue from '../../data/chothuenha.json'
import chothuephongtro from '../../data/chothuephongtro.json'
import { dataPrice, dataArea } from '../utils/data'


const dataBody = [
    {
        body: chothuephongtro.body,
        code: 'CTPT'
    },
    {
        body: chothuematbang.body,
        code: 'CTMB'
    },
    {
        body: chothuecanho.body,
        code: 'CTCH'
    },
    {
        body: nhachothue.body,
        code: 'NCT'
    },
]

const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

export const insert = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const provinceCodes = []
            const labelCodes = []
            const districtCodes = []
            const wardCodes = []
            const addressCodes = []

            dataBody.forEach(async (cate) => {
                cate.body.forEach(async (item) => {

                    let areaCurrent = getNumberFromStringAcreage(item?.header?.attributes?.acreage)
                    let currentPrice = getNumberFromString(item?.header?.attributes?.price)
                    let imagesId = v4()
                    let postId = v4()
                    let userId = v4()
                    const labelcode = generateCode(item?.header?.class?.classType?.trim());
                    labelCodes?.every(item => item?.code !== labelcode) && labelCodes.push({
                        code: labelcode,
                        value: item?.header?.class?.classType?.trim()
                    })
                    const provinceCode = generateCode(item?.header?.address?.split(',')?.slice(-1)[0]?.trim());
                    provinceCodes?.every(item => item?.code !== provinceCode) && provinceCodes.push({
                        code: provinceCode,
                        value: item?.header?.address?.split(',')?.slice(-1)[0]?.trim()
                    })

                    const districtCode = generateCode(item?.header?.address?.split(',')[item?.header?.address?.split(',').length - 2]?.trim());
                    districtCodes?.every(item => item?.code !== districtCode) && districtCodes.push({
                        code: districtCode,
                        value: item?.header?.address?.split(',')[item?.header?.address?.split(',').length - 2]?.trim(),
                        provinceCode: provinceCode
                    })

                    const wardCode = generateCode(item?.header?.address?.split(',')[item?.header?.address?.split(',').length - 3]?.trim());
                    wardCodes?.every(item => item?.code !== wardCode) && wardCodes.push({
                        code: wardCode,
                        value: item?.header?.address?.split(',')[item?.header?.address?.split(',').length - 3]?.trim(),
                        districtCode: districtCode,
                        provinceCode: provinceCode
                    })

                    const addressCode = generateCode(item?.header?.address?.split(',')[item?.header?.address?.split(',').length - 4]?.trim()?.replace('Địa chỉ: ', ''));
                    addressCodes?.every(item => item?.code !== addressCode) && addressCodes.push({
                        code: addressCode,
                        value: item?.header?.address?.split(',')[item?.header?.address?.split(',').length - 4]?.trim()?.replace('Địa chỉ: ', ''),
                        districtCode: districtCode,
                        provinceCode: provinceCode,
                        wardCode: wardCode
                    })

                    await db.User.create({
                        id: userId,
                        name: item?.contact?.content?.find(i => i.name === "Liên hệ:")?.content,
                        password: hashPassword('123456789'),
                        fbUrl: 'https://www.facebook.com/anoni',
                        role: 'user',
                        email: 'anoni@gmail.com',
                        avatar: 'https://phongtro123.com/images/default-user.png',
                        phone: item?.contact?.content?.find(i => i.name === "Điện thoại:")?.content,
                        zalo: item?.contact?.content?.find(i => i.name === "Zalo")?.content,
                        statusCode: 'S5'
                    })

                    await db.Image.create({
                        id: imagesId,
                        images: JSON.stringify(item?.images)
                    })

                    await db.Post.create({
                        id: postId,
                        title: item?.header?.title,
                        labelCode: labelcode,
                        categoryCode: cate.code,
                        description: JSON.stringify(item?.mainContent?.content),
                        userId: userId,
                        imageId: imagesId,
                        priceCode: dataPrice.find(price => price.max > +currentPrice && price.min <= +currentPrice)?.code,
                        acreageCode: dataArea.find(area => area.max > +areaCurrent && area.min <= +areaCurrent)?.code,
                        addressCode,
                        provinceCode,
                        wardCode,
                        districtCode,
                        target: 'Tất cả',
                        statusCode: 'S2',
                        priceNumber: +currentPrice,
                        acreageNumber: +areaCurrent,
                        expiredAt: new Date(new Date().getTime() + (100 * 24 * 60 * 60 * 1000))
                    })
                })
            })

            provinceCodes?.forEach(async (item) => {
                await db.Province.create(item)
            })
            districtCodes?.forEach(async (item) => {
                await db.District.create(item)
            })
            wardCodes?.forEach(async (item) => {
                await db.Ward.create(item)
            })
            addressCodes?.forEach(async (item) => {
                await db.Address.create(item)
            })
            labelCodes?.forEach(async (item) => {
                await db.Label.create(item)
            })
            resolve('done')
        }
        catch (e) {
            reject(e);
        }
    })
}

// export const createPriceArea = () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             dataPrice.forEach(async (item) => {
//                 await db.Price.create({
//                     code: item.code,
//                     value: item.value
//                 })
//             })

//             dataArea.forEach(async (item) => {
//                 await db.Acreage.create({
//                     code: item.code,
//                     value: item.value
//                 })
//             })
//             resolve('donePrice')
//         }
//         catch (e) {
//             reject(e);
//         }
//     })
// }
