import { Request, Response } from 'express';
import { OrderType, PrismaClient,OrderStatus_new } from '@prisma/client';
 
const prisma = new PrismaClient();

export const products = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany();
        
        res.status(200).json({products })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }


}

export const getItemById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const product = await prisma.product.findUnique({where:{id:id}});
        console.log(product)
        res.status(200).json({ product : product })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
}



 
export const order = async (req: Request, res: Response) => {
    const { cart} = req.body;

    console.log(cart);
    const customerid = req.user?.id;
    console.log("customerid : " + customerid)

    try {
        // Ensure totalAmount is properly calculated
        const totalAmount = cart.reduce((sum: number, item: any) => 
            sum + (item.price || 0) * (item.quantity || 0), 0);

        if (!customerid) {
             res.status(400).json({ message: "Customer ID is required" });
             return
        }

        if (!cart || cart.length === 0) {
             res.status(400).json({ message: "Cart cannot be empty" });
             return
        }

        const order = await prisma.order.create({
            data: {
                customerId: customerid,   
                orderType: OrderType.CUSTOMER,
                status: "PENDING",
                totalAmount: totalAmount,
                paymentStatus: "PENDING",
                products: {
                    create: cart.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity || 1, 
                    })),
                },
            },
            include: {
                products: true,
            },
        });
        

        

        res.status(201).json({
            message: "Order placed successfully",
            order,
        });
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
};