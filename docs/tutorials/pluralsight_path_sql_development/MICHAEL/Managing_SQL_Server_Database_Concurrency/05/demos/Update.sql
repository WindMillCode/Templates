USE TimShoes;
GO

BEGIN TRAN;
    UPDATE Orders.Orders
    SET OrderRequestedDate = '30000101'
    WHERE OrderID = 1;
    WAITFOR DELAY '00:00:10';
ROLLBACK;
