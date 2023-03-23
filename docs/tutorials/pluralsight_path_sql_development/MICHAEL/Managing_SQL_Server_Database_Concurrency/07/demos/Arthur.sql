USE TimShoes;
GO

DECLARE @Context varbinary(10) = CAST('Arthur' as varbinary);
SET CONTEXT_INFO @Context;
SET TRAN ISOLATION LEVEL REPEATABLE READ;
SET LOCK_TIMEOUT -1;

BEGIN TRAN;
    SELECT * FROM Orders.Orders;
ROLLBACK;
