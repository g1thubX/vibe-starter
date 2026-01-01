use anchor_lang::prelude::*;

declare_id!("2669p3Q1tSrw1wGVJPs6w6nn8CxWmhdSWSHN5D7Fhgbu");

#[program]
pub mod withdraw_app {
    use super::*;

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let user = &mut ctx.accounts.user;

        let rent_exempt_lamports = Rent::get()?.minimum_balance(vault.to_account_info().data_len());
        if vault.to_account_info().lamports() < amount + rent_exempt_lamports {
            return Err(ProgramError::InsufficientFunds.into());
        }

        **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **user.to_account_info().try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump,
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Vault {}
