<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 10 random users
        \App\Models\User::factory(10)->create();

        // Create an admin user
        \App\Models\User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);
        
        // Seed organization profile data in key-value format
        $orgProfileData = [
            ['input_label' => 'organization_name', 'input_text' => 'CryptoWallet'],
            ['input_label' => 'logo', 'input_text' => 'logo.png'],
            ['input_label' => 'favicon', 'input_text' => 'favicon.ico'],
            ['input_label' => 'email', 'input_text' => 'info@cryptowallet.com'],
            ['input_label' => 'phone', 'input_text' => '+1 (555) 123-4567'],
            ['input_label' => 'address', 'input_text' => '123 Blockchain Street, Crypto City, CC 12345'],
            ['input_label' => 'website', 'input_text' => 'https://cryptowallet.com'],
            ['input_label' => 'description', 'input_text' => 'A secure cryptocurrency wallet platform for trading and managing digital assets.'],
            ['input_label' => 'facebook', 'input_text' => 'https://facebook.com/cryptowallet'],
            ['input_label' => 'twitter', 'input_text' => 'https://twitter.com/cryptowallet'],
            ['input_label' => 'instagram', 'input_text' => 'https://instagram.com/cryptowallet'],
            ['input_label' => 'linkedin', 'input_text' => 'https://linkedin.com/company/cryptowallet'],
            ['input_label' => 'youtube', 'input_text' => 'https://youtube.com/c/cryptowallet'],
        ];
        
        // Add additional org profile data from home page
        $additionalOrgProfileData = [
            // Crypto definitions
            ['input_label' => 'crypto_definition', 'input_text' => 'A cryptocurrency is a digital or virtual currency that is secured by cryptography, which makes it nearly impossible to counterfeit or double-spend.'],
            ['input_label' => 'bnb_definition', 'input_text' => 'We are reinventing the global equity Blockchain -that is a smart, secure and easy – to use platform BNB (BEP20) & BUSD Coins is a Decentralized, open-source Blockchain-based operating system with smart contract functionality, proof-of-stake principles as its consensus algorithm and a cryptocurrency native to the system, known as BNB (BEP20) & BUSD Coins.'],
            
            // Features
            ['input_label' => 'semi_decentralized_definition', 'input_text' => 'The Project is Semi Decentralized Program.'],
            ['input_label' => 'safe_wallets_definition', 'input_text' => 'We are Working with Safe Zone by using Higher Security.'],
            ['input_label' => 'p2p_definition', 'input_text' => 'No need to withdrawal any of your income'],
            ['input_label' => 'semi_decentralized_details', 'input_text' => 'Semi Decentralized marketing is created with an automated contract that offers you maximum security and sustainability. A smart contract is an automatic execution algorithm. It exists within the BUSD blockchain, one of the TOP cryptographic currencies.'],
            
            // Business plan details
            ['input_label' => 'sponsor_bonus', 'input_text' => 'Sponsor Bonus – 25% - On Direct Joining'],
            ['input_label' => 'level_income', 'input_text' => 'Level Income – 25% - On Level 01 up to Level 07'],
            ['input_label' => 'autopool_bonus', 'input_text' => 'Autopool Bonus- 40% - On Direct Sponsor, to the Upline & Upline to Upline(Till 3rd level)'],
            ['input_label' => 'dividends_bonus', 'input_text' => 'Dividends Bonus :- 10% - On Nonworking'],
            ['input_label' => 'royality_bonus', 'input_text' => 'Royality Bonus - 50%'],
            ['input_label' => 'package_income', 'input_text' => 'Package Income - 57%'],
            ['input_label' => 'package_level_bonus', 'input_text' => 'Package Level Bonus - 25%'],
            ['input_label' => 'boosting_bonus', 'input_text' => 'Boosting Bonus - 300%'],
            ['input_label' => 'boosting_levelwise_income', 'input_text' => 'Boosting Levelwise Income - 25%'],
            
            // Company values
            ['input_label' => 'competent_professionals', 'input_text' => 'Competent Professionals'],
            ['input_label' => 'affordable_prices', 'input_text' => 'Affordable Prices'],
            ['input_label' => 'high_successful_recovery', 'input_text' => 'High Successful Recovery'],
            ['input_label' => 'new_way_making_money', 'input_text' => 'A New Way Of Making Money'],
            
            // Company stats
            ['input_label' => 'team_advisors', 'input_text' => '20'],
            ['input_label' => 'years_of_experience', 'input_text' => '5'],
            
            // Maps and external integrations
            ['input_label' => 'google_map', 'input_text' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2164183446313!2d-73.9860359!3d40.7484406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1615240548477!5m2!1sen!2sus'],
            ['input_label' => 'full_address', 'input_text' => '123 Blockchain Street, Crypto City, CC 12345, United States'],
            
            // Meta information
            ['input_label' => 'meta_keywords', 'input_text' => 'cryptocurrency, wallet, blockchain, crypto, digital assets, BNB, USDT'],
            ['input_label' => 'meta_author', 'input_text' => 'CryptoWallet Team'],
            ['input_label' => 'meta_description', 'input_text' => 'A secure cryptocurrency wallet platform for trading and managing digital assets with BNB (BEP20) & USDT integration.'],
            ['input_label' => 'og_title', 'input_text' => 'CryptoWallet - Secure Cryptocurrency Management'],
            ['input_label' => 'og_description', 'input_text' => 'Manage your cryptocurrencies securely with our advanced wallet platform. Supporting BNB (BEP20) & USDT coins.'],
            ['input_label' => 'og_image', 'input_text' => 'og-image.jpg'],
            
            // Footer information
            ['input_label' => 'footer_text', 'input_text' => 'Every single minute of every person should be dedicated to strengthening the powerful system. We must believe in our completely transparent system.'],
            ['input_label' => 'copyright_text', 'input_text' => 'Copyright © 2025 CryptoWallet All rights reserved.'],
        ];
        
        // Merge existing and new org profile data
        $allOrgProfileData = array_merge($orgProfileData, $additionalOrgProfileData);
        
        foreach ($allOrgProfileData as $data) {
            DB::table('cms_org_profiles')->insert([
                'input_label' => $data['input_label'],
                'input_text' => $data['input_text'],
                'is_status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}