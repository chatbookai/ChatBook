// @ts-ignore
import { NextApiRequest, NextApiResponse } from 'next';
import { checkUserToken } from '../../../utils/user';
import { MenuListAdmin, MenuListUser } from '../../../utils/const';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const MenuListAdminFilter = MenuListAdmin.filter( Item => Item && Item.title)
        res.status(200).json(MenuListAdminFilter);
    }
    else if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'user') {
        res.status(200).json(MenuListUser);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
}
