USE TimShoes;
GO

SET TRANSACTION ISOLATION LEVEL SNAPSHOT;
SET LOCK_TIMEOUT 15000;

BEGIN TRAN;
    UPDATE Orders.Orders
    SET OrderRequestedDate = '30000101'
    WHERE OrderID = 1;
    WAITFOR DELAY '00:00:20';
COMMIT;

SELECT * FROM Orders.Orders;
