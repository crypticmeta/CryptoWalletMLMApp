<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Site\SiteController;
use App\Http\Controllers\member\MemberAuthController;
use App\Http\Controllers\member\DashboardController;
use App\Http\Controllers\member\ProfileController;
use App\Http\Controllers\member\UpdateKYCController;
use App\Http\Controllers\member\MemberPackageController;
use App\Http\Controllers\member\TransactionController;
use App\Http\Controllers\member\WithdrawalController;
use App\Http\Controllers\member\PlanChartController;
use App\Http\Controllers\member\WelcomeController;
use App\Http\Controllers\member\MydirectController;
use App\Http\Controllers\member\DownLineListController;
use App\Http\Controllers\member\NetworkExplorerController;
use App\Http\Controllers\member\support\MTicketController;
use App\Http\Controllers\member\IncomeReportController;

// Site 
Route::get('/',[SiteController::class, 'Index'])
->name('index');
Route::get('/about-us',[SiteController::class, 'AboutUs'])
->name('about-us');
Route::get('/contact-us',[SiteController::class, 'ContactUs'])
->name('contact-us');
Route::post('/contact-details',[SiteController::class, 'ContactDetails'])
->name('contact-details');
Route::get('/Blog-list',[SiteController::class, 'BlogList'])
->name('blog-list');
Route::get('/blog-details/{id}',[SiteController::class, 'BlogDetais'])
->name('blogDetails');
Route::get('/features',[SiteController::class, 'Features'])
->name('features');
Route::get('/FAQ',[SiteController::class, 'FAQ'])
->name('FAQ');

Route::get('/Search',[SiteController::class, 'Report'])
->name('Report');
Route::post("/ReportSearch",[SiteController::class, 'siteReport'])->name('site-report');

// register
Route::get("/member/registration/{upline}",[MemberAuthController::class, 'registerform'])->name('member-registration');
Route::get("/member/registration",[MemberAuthController::class, 'registerformopen'])->name('member-registration-open');
Route::post("member/register",[MemberAuthController::class, 'register'])->name('member-register');

// login
Route::group(['namespace'=>'member','middleware'=>'memberpublicpages'],function(){

Route::get('member/login', [MemberAuthController::class, 'showLoginForm'])->name('member-signin');
Route::post("member/loginauto",[MemberAuthController::class, 'autologin'])->name('member-login-auto');

});

Route::group(['namespace'=>'member','middleware'=>'memberprotectedpages'],function(){

    Route::get("/member/dashboard",[DashboardController::class, 'showdashboard'])->name('member-dashboard');

    Route::get(config('app.member_folder')."/logout",[MemberAuthController::class, 'memberlogout'])->name('member-logout');

    // profile
    Route::get(config('app.member_folder')."/showProfile",[ProfileController::class,'showProfile'])->name('member-showProfile');
    Route::get(config('app.member_folder')."/editprofile",[ProfileController::class, 'editprofile'])->name('member-editprofile');
    Route::POST(config('app.member_folder')."/Profile",[ProfileController::class,'Profile'])->name('member-Profile');

    //  update kyc
    Route::get(config('app.member_folder')."/editKYC",[UpdateKYCController::class, 'editKYC'])->name('member-editKYC');
    Route::POST(config('app.member_folder')."/updateKYC",[UpdateKYCController::class,'updateKYC'])->name('member-updateKYC');

    // Package
    Route::get(config('app.member_folder')."/buy/{type}",[MemberPackageController::class, 'buypackage'])->name('member-buy-package');
    Route::POST(config('app.member_folder')."/buypackage",[MemberPackageController::class,'buypack'])->name('member.pack.buy');
    Route::POST(config('app.member_folder')."/buyboosting",[MemberPackageController::class,'buyboost'])->name('member.boost.buy');

       // transaction 
       Route::get(config('app.member_folder') . "/transaction", [TransactionController::class, 'index'])->name('member-transaction');

       //Withdrawal
       Route::get(config('app.member_folder') . "/withdrawals", [WithdrawalController::class, 'withdrawals'])->name('member-search-withdrawals');

       //    pdf
       Route::get(config('app.member_folder')."/planChart",[PlanChartController::class,'planChart'])->name('member-planChart');
 
       //    welcome letter
       Route::get(config('app.member_folder')."/welcome",[WelcomeController::class,'welcome'])->name('member-welcome');

           //myDirect
        Route::get(config('app.member_folder') . "/myDirect", [MydirectController::class, 'myDirect'])->name('member-search-myDirect');

        //downlineList
        Route::get(config('app.member_folder') . "/downlineList", [DownLineListController::class, 'downlineList'])->name('member-search-downlineList');

        //networkExplorer
        Route::get(config('app.member_folder') . "/networkExplorer", [NetworkExplorerController::class, 'networkExplore'])->name('member-network-explore');

            // income report
        Route::get(config('app.member_folder') . "/listIncomeReports/{income}", [IncomeReportController::class, 'showIncomeData'])->name('member-search-Income-listIncomeReports');
        
         // Ticket
        Route::get(config('app.member_folder') . "/ticket", [MTicketController::class, 'show'])->name('member-show-ticket');
        Route::post(config('app.member_folder') . "/addticket", [MTicketController::class, 'insert'])->name('member-insert-ticket');
        Route::get(config('app.member_folder') . "/listTicket/{id}", [MTicketController::class, 'deleteData'])->name('member-delete-ticket');
        // Route::get(config('app.member_folder')."/editTicket/{id}",[MTicketController::class,'editTicket'])->name('edit-ticket');
        Route::post(config('app.member_folder') . "/updateTicket/{id}", [MTicketController::class, 'updateTicket'])->name('member-update-ticket');
        Route::get(config('app.member_folder') . "/listTicket", [MTicketController::class, 'showData'])->name('member-search-listTicket');
        //  Route::put(config('app.member_folder')."/listTicket/status/{id}",[MTicketController::class, 'updateStatus']);
        Route::get(config('app.member_folder') . "/ticketchat/{id}", [MTicketController::class, 'showchat'])->name('member-show-ticketchat');
        Route::post(config('app.member_folder') . "/Update-ticket", [MTicketController::class, 'updateChat'])->name('member-set-updateTicket');
        Route::post(config('app.member_folder') . "/sendAdminMsg/{id}", [MTicketController::class, 'sendmembermsg'])->name('send-member-msg');

        // withdraw
        Route::POST(config('app.member_folder')."/withdrawPay",[DashboardController::class,'withdraw'])->name('member.withdraw.auto');
        
});

// Add a test route
Route::get('/hello', function () {
    return 'Hello World';
});